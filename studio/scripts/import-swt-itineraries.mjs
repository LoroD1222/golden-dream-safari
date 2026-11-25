import {createHash} from 'node:crypto'
import {readFileSync} from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-11-17'})
const projectRoot = path.resolve(process.cwd(), '..')
const seedTrips = JSON.parse(readFileSync(path.join(projectRoot, 'data/seed-itineraries.json'), 'utf8'))
const allTrips = seedTrips.filter((trip) => trip.sourceId?.startsWith('swt:'))
const startIndex = Number.parseInt(process.env.SWT_START_INDEX || '0', 10)
const trips = allTrips.slice(Number.isNaN(startIndex) ? 0 : startIndex)
const assetCache = new Map()

if (allTrips.length !== 20) throw new Error(`Expected 20 SWT itineraries; found ${allTrips.length}.`)

function stableKey(prefix, identity) {
  return `${prefix}-${createHash('sha1').update(String(identity)).digest('hex').slice(0, 20)}`
}

function keyed(_type, value, identity = JSON.stringify(value)) {
  return {_type, _key: stableKey(_type, identity), ...value}
}

async function uploadImage(source) {
  if (!source) return undefined
  if (assetCache.has(source)) return assetCache.get(source)
  if (!source.startsWith('/images/itineraries/swt/')) throw new Error(`SWT importer rejected an out-of-scope image: ${source}`)
  const filename = path.basename(source)
  const upload = client.fetch(
    '*[_type == "sanity.imageAsset" && originalFilename == $filename] | order(_createdAt desc)[0]._id',
    {filename},
  ).then(async (existingId) => {
    if (existingId) {
      process.stdout.write(`Reused ${source}\n`)
      return existingId
    }
    const asset = await client.assets.upload('image', readFileSync(path.join(projectRoot, 'public', source)), {filename})
    process.stdout.write(`Uploaded ${source}\n`)
    return asset._id
  })
  assetCache.set(source, upload)
  return upload
}

async function imageValue(source, alt, caption) {
  const assetId = await uploadImage(source)
  if (!assetId) return undefined
  return {
    _type: 'goldenDreamImage',
    image: {_type: 'image', asset: {_type: 'reference', _ref: assetId}},
    alt: alt || 'Golden Dream Safaris image',
    ...(caption ? {caption} : {}),
  }
}

async function imageArray(images = []) {
  return Promise.all(images.map(async (item) => ({...(await imageValue(item.src, item.alt, item.caption)), _key: stableKey('image', item.src)})))
}

for (const trip of trips) {
  const existing = await client.fetch(
    '*[_type == "goldenDreamItinerary" && (sourceId == $sourceId || slug.current == $slug)][0]{_id}',
    {sourceId: trip.sourceId, slug: trip.slug},
  )
  const days = await Promise.all(trip.days.map(async (day) => keyed('itineraryDay', {
    dayNumber: day.dayNumber,
    title: day.title,
    summary: day.summary,
    narrative: day.narrative,
    habitat: day.habitat,
    driveTime: day.driveTime,
    distance: day.distance,
    activityLevel: day.activityLevel,
    meals: day.meals,
    activities: (day.activities || []).map((activity) => keyed('itineraryActivity', {
      title: activity.title,
      description: activity.description,
      time: activity.time,
      location: activity.location,
    }, activity.id || `${day.id}-${activity.title}`)),
    accommodation: day.accommodation ? {
      _type: 'itineraryAccommodation',
      name: day.accommodation.name,
      category: day.accommodation.category,
      location: day.accommodation.location,
      description: day.accommodation.description,
    } : undefined,
    image: await imageValue(day.image, day.imageAlt || `${trip.title}, day ${day.dayNumber}`),
    dropOffNote: day.dropOffNote,
  }, day.id || `${trip.slug}-day-${day.dayNumber}`)))

  const value = {
    _type: 'goldenDreamItinerary',
    legacyId: trip.id,
    sourceId: trip.sourceId,
    sourcePath: trip.sourcePath,
    sourceUrl: trip.sourceUrl,
    tripType: trip.tripType,
    routeFamily: trip.routeFamily,
    title: trip.title,
    slug: {_type: 'slug', current: trip.slug},
    summary: trip.summary,
    heroImage: await imageValue(trip.heroImage, `${trip.title} hero image`),
    overviewTitle: trip.overviewTitle,
    overviewParagraphs: trip.overviewParagraphs,
    highlights: trip.highlights,
    galleryImages: await imageArray(trip.galleryImages),
    routeStops: (trip.routeStops || []).map((stop) => keyed('itineraryRouteStop', {
      name: stop.name,
      label: stop.label,
      description: stop.description,
      dayNumber: stop.dayNumber,
      coordinates: {_type: 'geopoint', lat: stop.coordinates.lat, lng: stop.coordinates.lng},
    }, `${trip.slug}-${stop.dayNumber}-${stop.name}`)),
    durationDays: trip.durationDays,
    destinations: trip.destinations,
    travelStyle: trip.travelStyle,
    startingPrice: trip.startingPrice,
    currency: trip.currency,
    days,
    inclusions: trip.inclusions,
    exclusions: trip.exclusions,
    onRequestItems: trip.onRequestItems,
    priceIntroduction: trip.priceIntroduction,
    priceTiers: (trip.priceTiers || []).map((tier) => keyed('itineraryPriceTier', tier, `${trip.slug}-${tier.name}`)),
    optionalExperiences: (trip.optionalExperiences || []).map((experience) => keyed('optionalExperience', experience, `${trip.slug}-${experience.name}`)),
    practicalInformation: trip.practicalInformation,
    packingNotes: trip.packingNotes,
    bookingConditions: trip.bookingConditions,
    faqs: (trip.faqs || []).map((faq) => keyed('itineraryFaq', faq, `${trip.slug}-${faq.question}`)),
    relatedTrips: [],
    status: trip.status,
  }

  if (existing?._id) {
    await client.patch(existing._id).set(value).commit()
    process.stdout.write(`Updated ${trip.slug}\n`)
  } else {
    await client.create(value)
    process.stdout.write(`Created ${trip.slug}\n`)
  }
}

const lemosho = seedTrips.find((trip) => trip.slug === '8-days-lemosho-route')
const lemoshoDocument = await client.fetch(
  `*[_type == "goldenDreamItinerary" && slug.current == $slug][0]{
    _id,
    days[]{_key, _type, dayNumber, title, summary, narrative, habitat, driveTime, distance, activityLevel, meals,
      activities[]{_key, _type, title, description, time, location}, accommodation, accommodations, image, dropOffNote},
    routeStops[]{_key, _type, name, label, description, dayNumber, coordinates}
  }`,
  {slug: lemosho.slug},
)

if (!lemoshoDocument?._id) throw new Error('The connected Sanity dataset is missing the 8 Days Lemosho itinerary.')

const lemoshoDays = lemoshoDocument.days.map((day) => {
  const sourceDay = lemosho.days.find((item) => item.dayNumber === day.dayNumber)
  if (!sourceDay) throw new Error(`Missing verified Lemosho day ${day.dayNumber}.`)
  return {
    ...day,
    title: sourceDay.title,
    summary: sourceDay.summary,
    narrative: sourceDay.narrative,
    activities: (day.activities || []).map((activity, index) => ({
      ...activity,
      description: sourceDay.activities[index]?.description || sourceDay.narrative,
    })),
  }
})

const lemoshoStops = (lemoshoDocument.routeStops || []).map((stop) => ({
  ...stop,
  description: lemosho.days.find((day) => day.dayNumber === stop.dayNumber)?.summary || stop.description,
}))

await client.patch(lemoshoDocument._id).set({
  sourcePath: lemosho.sourcePath,
  sourceUrl: lemosho.sourceUrl,
  title: lemosho.title,
  summary: lemosho.summary,
  overviewTitle: lemosho.overviewTitle,
  overviewParagraphs: lemosho.overviewParagraphs,
  durationDays: lemosho.durationDays,
  startingPrice: lemosho.startingPrice,
  priceIntroduction: lemosho.priceIntroduction,
  priceTiers: lemosho.priceTiers.map((tier) => keyed('itineraryPriceTier', tier, `${lemosho.slug}-${tier.name}`)),
  days: lemoshoDays,
  routeStops: lemoshoStops,
}).commit()
process.stdout.write(`Updated ${lemosho.slug} from the current published SWT route without replacing its Sanity images.\n`)

process.stdout.write(`Imported ${trips.length} SWT itineraries starting at index ${startIndex || 0}. No reviews, settings, accommodations or unrelated trips were changed.\n`)
