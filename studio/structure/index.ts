import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Golden Dream Content')
    .items([
      S.documentTypeListItem('goldenDreamItinerary').title('Safari itineraries'),
    ])
