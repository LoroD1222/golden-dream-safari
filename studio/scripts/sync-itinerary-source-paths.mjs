import {readFileSync} from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-11-19'})
const projectRoot = path.resolve(process.cwd(), '..')
const trips = JSON.parse(readFileSync(path.join(projectRoot, 'data/seed-itineraries.json'), 'utf8'))

for (const trip of trips) {
  const sourceId = trip.sourceId || trip.id
  const document = await client.fetch(
    '*[_type == "goldenDreamItinerary" && (sourceId == $sourceId || legacyId == $legacyId || slug.current == $slug)][0]{_id}',
    {sourceId, legacyId: trip.id, slug: trip.slug},
  )
  if (!document?._id) throw new Error(`Missing Sanity itinerary for ${trip.slug}`)
  await client.patch(document._id).set({sourcePath: trip.sourcePath || path.basename(trip.sourceUrl || trip.slug)}).commit()
}

process.stdout.write(`Synced safe source labels for ${trips.length} itineraries.\n`)
