import {CogIcon} from '@sanity/icons/Cog'
import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'
import {HomeIcon} from '@sanity/icons/Home'
import {StarIcon} from '@sanity/icons/Star'
import {TagIcon} from '@sanity/icons/Tag'
import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website Content')
    .items([
      S.listItem()
        .title('Trip Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('goldenDreamSettings').documentId('goldenDreamSettings').title('Trip Settings')),
      S.documentTypeListItem('goldenDreamItinerary').title('Trips').icon(EarthGlobeIcon),
      S.documentTypeListItem('goldenDreamAccommodation').title('Accommodations').icon(HomeIcon),
      S.divider(),
      S.documentTypeListItem('goldenDreamReview').title('Reviews').icon(StarIcon),
      S.documentTypeListItem('goldenDreamReviewCategory').title('Review Categories').icon(TagIcon),
    ])
