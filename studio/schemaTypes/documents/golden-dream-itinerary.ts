import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'
import {defineArrayMember, defineField, defineType} from 'sanity'

type DayValue = {dayNumber?: number}

function validateDays(days?: DayValue[]) {
  if (!days?.length) return true
  return days.every((day, index) => day.dayNumber === index + 1) || 'Day numbers must be consecutive and match the list order.'
}

export const goldenDreamItinerary = defineType({
  name: 'goldenDreamItinerary',
  title: 'Trip',
  type: 'document',
  icon: EarthGlobeIcon,
  groups: [
    {name: 'overview', title: 'Overview', default: true},
    {name: 'gallery', title: 'Gallery & route'},
    {name: 'itinerary', title: 'Day by day'},
    {name: 'price', title: 'Price'},
    {name: 'included', title: 'Included / excluded'},
    {name: 'practical', title: 'Practical information'},
    {name: 'publishing', title: 'Publishing'},
  ],
  fields: [
    defineField({name: 'legacyId', type: 'string', hidden: true, readOnly: true}),
    defineField({name: 'title', title: 'Title', type: 'string', group: 'overview', validation: (rule) => rule.required().min(2).max(180)}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', group: 'overview', options: {source: 'title', maxLength: 120}, validation: (rule) => rule.required()}),
    defineField({name: 'summary', title: 'Summary', type: 'text', rows: 4, group: 'overview', validation: (rule) => rule.required().min(10).max(4000)}),
    defineField({name: 'heroImage', title: 'Hero image', type: 'goldenDreamImage', group: 'overview'}),
    defineField({name: 'overviewTitle', title: 'Overview heading', type: 'string', group: 'overview', validation: (rule) => rule.max(180)}),
    defineField({name: 'overviewParagraphs', title: 'Overview paragraphs', type: 'array', group: 'overview', of: [defineArrayMember({type: 'text', rows: 4})], validation: (rule) => rule.max(12)}),
    defineField({name: 'highlights', title: 'Highlights', type: 'array', group: 'overview', of: [defineArrayMember({type: 'string'})], validation: (rule) => rule.max(24).unique()}),
    defineField({name: 'destinations', title: 'Destinations', type: 'array', group: 'overview', of: [defineArrayMember({type: 'string'})], validation: (rule) => rule.required().min(1).max(30).unique()}),
    defineField({name: 'travelStyle', title: 'Travel style', type: 'string', group: 'overview', validation: (rule) => rule.max(160)}),
    defineField({name: 'galleryImages', title: 'Gallery images', type: 'array', group: 'gallery', of: [defineArrayMember({type: 'goldenDreamImage'})], validation: (rule) => rule.max(30)}),
    defineField({name: 'routeStops', title: 'Route stops', type: 'array', group: 'gallery', of: [defineArrayMember({type: 'itineraryRouteStop'})], validation: (rule) => rule.max(30)}),
    defineField({name: 'durationDays', title: 'Duration in days', type: 'number', group: 'itinerary', validation: (rule) => rule.required().integer().min(1).max(60).custom((value, context) => {
      const days = context.document?.days as unknown[] | undefined
      return !days || value === days.length || 'Duration must match the number of itinerary days.'
    })}),
    defineField({name: 'days', title: 'Days', type: 'array', group: 'itinerary', of: [defineArrayMember({type: 'itineraryDay'})], validation: (rule) => rule.required().min(1).max(60).custom((days) => validateDays(days as DayValue[] | undefined))}),
    defineField({name: 'startingPrice', title: 'Starting price', type: 'number', group: 'price', validation: (rule) => rule.min(0)}),
    defineField({name: 'currency', title: 'Currency', type: 'string', group: 'price', initialValue: 'USD', options: {list: [{title: 'US dollar (USD)', value: 'USD'}, {title: 'Euro (EUR)', value: 'EUR'}, {title: 'British pound (GBP)', value: 'GBP'}, {title: 'Tanzanian shilling (TZS)', value: 'TZS'}], layout: 'radio'}, validation: (rule) => rule.required().length(3)}),
    defineField({name: 'priceIntroduction', title: 'Price introduction', type: 'text', rows: 5, group: 'price', validation: (rule) => rule.max(3000)}),
    defineField({name: 'priceTiers', title: 'Price tiers', type: 'array', group: 'price', of: [defineArrayMember({type: 'itineraryPriceTier'})], validation: (rule) => rule.max(12)}),
    defineField({name: 'optionalExperiences', title: 'Optional experiences', type: 'array', group: 'price', of: [defineArrayMember({type: 'optionalExperience'})], validation: (rule) => rule.max(30)}),
    defineField({name: 'inclusions', title: 'Included', type: 'array', group: 'included', of: [defineArrayMember({type: 'string'})], validation: (rule) => rule.max(60).unique()}),
    defineField({name: 'exclusions', title: 'Not included', type: 'array', group: 'included', of: [defineArrayMember({type: 'string'})], validation: (rule) => rule.max(60).unique()}),
    defineField({name: 'onRequestItems', title: 'Available on request', type: 'array', group: 'included', of: [defineArrayMember({type: 'string'})], validation: (rule) => rule.max(40).unique()}),
    defineField({name: 'practicalInformation', title: 'Practical travel information', type: 'array', group: 'practical', of: [defineArrayMember({type: 'text', rows: 3})], validation: (rule) => rule.max(40)}),
    defineField({name: 'packingNotes', title: 'Packing notes', type: 'array', group: 'practical', of: [defineArrayMember({type: 'text', rows: 3})], validation: (rule) => rule.max(40)}),
    defineField({name: 'bookingConditions', title: 'Booking conditions', type: 'array', group: 'practical', of: [defineArrayMember({type: 'text', rows: 3})], validation: (rule) => rule.max(40)}),
    defineField({name: 'faqs', title: 'Trip FAQs', type: 'array', group: 'practical', of: [defineArrayMember({type: 'itineraryFaq'})], validation: (rule) => rule.max(30)}),
    defineField({name: 'relatedTrips', title: 'Related trips', type: 'array', group: 'publishing', of: [defineArrayMember({type: 'reference', to: [{type: 'goldenDreamItinerary'}]})], validation: (rule) => rule.max(12).unique()}),
    defineField({name: 'status', title: 'Website status', type: 'string', group: 'publishing', initialValue: 'draft', options: {list: [{title: 'Draft', value: 'draft'}, {title: 'Published', value: 'published'}], layout: 'radio'}, validation: (rule) => rule.required()}),
  ],
  preview: {
    select: {title: 'title', status: 'status', duration: 'durationDays', media: 'heroImage.image'},
    prepare({title, status, duration, media}) { return {title: title || 'Untitled trip', subtitle: `${duration || '—'} days · ${status || 'draft'}`, media} },
  },
})
