import {createHash} from 'node:crypto'
import {readFileSync} from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-11-17'})
const projectRoot = path.resolve(process.cwd(), '..')
const readJson = (file) => JSON.parse(readFileSync(path.join(projectRoot, file), 'utf8'))
const accommodations = readJson('data/accommodations.json')
const categories = readJson('data/review-categories.json')
const reviews = readJson('data/reviews.json')
const settings = readJson('data/site-settings.json')
const trips = readJson('data/seed-itineraries.json')
const assetCache = new Map()

function stableKey(prefix, identity) {
  return `${prefix}-${createHash('sha1').update(String(identity)).digest('hex').slice(0, 20)}`
}

function keyed(_type, value, identity = JSON.stringify(value)) {
  return {_type, _key: stableKey(_type, identity), ...value}
}

function references(ids) {
  return ids.filter(Boolean).map((_ref) => ({_type: 'reference', _key: stableKey('ref', _ref), _ref}))
}

async function uploadImage(source) {
  if (!source) return undefined
  if (assetCache.has(source)) return assetCache.get(source)
  if (!source.startsWith('/')) throw new Error(`Only local image paths can be imported: ${source}`)
  const filename = path.basename(source)
  const upload = client.assets.upload('image', readFileSync(path.join(projectRoot, 'public', source)), {filename}).then((asset) => {
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

async function upsertByLegacyId(_type, legacyId, value) {
  const existing = await client.fetch('*[_type == $type && legacyId == $legacyId][0]{_id}', {type: _type, legacyId})
  if (existing?._id) {
    await client.patch(existing._id).set(value).commit()
    return existing._id
  }
  const created = await client.create({_type, legacyId, ...value})
  return created._id
}

async function upsertItinerary(trip, value) {
  const sourceId = trip.sourceId || trip.id
  const existing = await client.fetch(
    '*[_type == "goldenDreamItinerary" && (sourceId == $sourceId || legacyId == $legacyId || slug.current == $slug)][0]{_id}',
    {sourceId, legacyId: trip.id, slug: trip.slug},
  )
  if (existing?._id) {
    await client.patch(existing._id).set({legacyId: trip.id, sourceId, ...value}).commit()
    return existing._id
  }
  const created = await client.create({_type: 'goldenDreamItinerary', legacyId: trip.id, sourceId, ...value})
  return created._id
}

const categoryIds = new Map()
for (const category of categories) {
  const id = await upsertByLegacyId('goldenDreamReviewCategory', category.id, {
    name: category.name,
    slug: {_type: 'slug', current: category.slug},
    description: category.description,
    status: category.status,
    order: category.order,
  })
  categoryIds.set(category.id, id)
}

const accommodationIds = new Map()
for (const accommodation of accommodations) {
  const id = await upsertByLegacyId('goldenDreamAccommodation', accommodation.id, {
    name: accommodation.name,
    slug: {_type: 'slug', current: accommodation.slug},
    category: accommodation.category,
    location: accommodation.location,
    description: accommodation.description,
    images: await imageArray(accommodation.images),
    website: accommodation.website,
    availabilityNote: accommodation.availabilityNote,
    status: accommodation.status,
    order: accommodation.order,
  })
  accommodationIds.set(accommodation.id, id)
}

const tripIds = new Map()
for (const trip of trips) {
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
    accommodations: references((day.accommodationIds || []).map((legacyId) => accommodationIds.get(legacyId))),
    accommodation: day.accommodation ? {
      _type: 'itineraryAccommodation',
      name: day.accommodation.name,
      category: day.accommodation.category,
      location: day.accommodation.location,
      description: day.accommodation.description,
      ...(day.accommodation.image ? {image: {
        _type: 'image',
        asset: {_type: 'reference', _ref: await uploadImage(day.accommodation.image)},
        alt: day.accommodation.name,
      }} : {}),
    } : undefined,
    image: await imageValue(day.image, day.imageAlt || `${trip.title}, day ${day.dayNumber}`),
    dropOffNote: day.dropOffNote,
  }, day.id || `${trip.slug}-day-${day.dayNumber}`)))
  const id = await upsertItinerary(trip, {
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
    status: trip.status,
  })
  tripIds.set(trip.slug, id)
}

for (const trip of trips) {
  const tripId = tripIds.get(trip.slug)
  if (!tripId) continue
  await client.patch(tripId).set({relatedTrips: references((trip.relatedTripSlugs || []).map((slug) => tripIds.get(slug)))}).commit()
}

for (const review of reviews) {
  await upsertByLegacyId('goldenDreamReview', review.id, {
    title: review.title,
    quote: review.quote,
    rating: review.rating,
    author: review.author,
    authorLocation: review.authorLocation,
    meta: review.meta,
    travelDate: review.travelDate,
    publishedDate: review.publishedDate,
    travelerType: review.travelerType,
    source: review.source,
    sourceUrl: review.sourceUrl,
    sourceReviewId: review.sourceReviewId,
    originalLanguage: review.originalLanguage,
    translated: review.translated,
    categories: references(review.categoryIds.map((legacyId) => categoryIds.get(legacyId))),
    trips: references(review.tripSlugs.map((slug) => tripIds.get(slug))),
    images: await imageArray(review.images),
    reply: review.reply,
    replyAuthor: review.replyAuthor,
    replyDate: review.replyDate,
    verified: review.verified,
    featuredOnHomepage: review.featuredOnHomepage,
    featuredOnTripPages: review.featuredOnTripPages,
    status: review.status,
    order: review.order,
  })
}

await client.createOrReplace({
  _id: 'goldenDreamSettings',
  _type: 'goldenDreamSettings',
  company: {
    ...settings.company,
    logo: await imageValue(settings.company.logo, `${settings.company.name} logo`),
  },
  tripDefaults: settings.tripDefaults,
  reviews: {
    ...settings.reviews,
    heroImage: await imageValue(settings.reviews.heroImage, 'Golden Dream guest reviews'),
  },
})

process.stdout.write(`Imported ${trips.length} trip, ${accommodations.length} accommodations, ${reviews.length} reviews, ${categories.length} review categories and trip settings.\n`)
