import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'
import {defineArrayMember, defineField, defineType} from 'sanity'

type DayValue = {dayNumber?: number}

function validateDays(days?: DayValue[]) {
  if (!days?.length) return true
  const valid = days.every((day, index) => day.dayNumber === index + 1)
  return valid || 'Day numbers must be consecutive and match the order of the list.'
}

export const goldenDreamItinerary = defineType({
  name: 'goldenDreamItinerary',
  title: 'Safari itinerary',
  type: 'document',
  icon: EarthGlobeIcon,
  groups: [
    {name: 'overview', title: 'Overview', default: true},
    {name: 'itinerary', title: 'Day by day'},
    {name: 'price', title: 'Price'},
    {name: 'included', title: 'Included / excluded'},
    {name: 'publishing', title: 'Publishing'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'overview',
      validation: (rule) => rule.required().min(2).max(180),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'overview',
      options: {source: 'title', maxLength: 120},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 5,
      group: 'overview',
      validation: (rule) => rule.required().min(10).max(4000),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      group: 'overview',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => rule.required().max(180),
        }),
      ],
    }),
    defineField({
      name: 'destinations',
      title: 'Destinations',
      type: 'array',
      group: 'overview',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.required().min(1).max(20).unique(),
    }),
    defineField({
      name: 'durationDays',
      title: 'Duration in days',
      type: 'number',
      group: 'itinerary',
      validation: (rule) => rule.required().integer().min(1).max(60).custom((value, context) => {
        const days = context.document?.days as unknown[] | undefined
        return !days || value === days.length || 'Duration must match the number of itinerary days.'
      }),
    }),
    defineField({
      name: 'days',
      title: 'Days',
      type: 'array',
      group: 'itinerary',
      of: [defineArrayMember({type: 'itineraryDay'})],
      validation: (rule) => rule.required().min(1).max(60).custom((days) => validateDays(days as DayValue[] | undefined)),
    }),
    defineField({
      name: 'startingPrice',
      title: 'Starting price',
      type: 'number',
      group: 'price',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      group: 'price',
      initialValue: 'USD',
      options: {
        list: [
          {title: 'US dollar (USD)', value: 'USD'},
          {title: 'Euro (EUR)', value: 'EUR'},
          {title: 'British pound (GBP)', value: 'GBP'},
          {title: 'Tanzanian shilling (TZS)', value: 'TZS'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required().length(3),
    }),
    defineField({
      name: 'inclusions',
      title: 'Included',
      type: 'array',
      group: 'included',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.max(40).unique(),
    }),
    defineField({
      name: 'exclusions',
      title: 'Not included',
      type: 'array',
      group: 'included',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.max(40).unique(),
    }),
    defineField({
      name: 'status',
      title: 'Website status',
      type: 'string',
      group: 'publishing',
      initialValue: 'draft',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Published', value: 'published'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', status: 'status', duration: 'durationDays', media: 'heroImage'},
    prepare({title, status, duration, media}) {
      return {
        title: title || 'Untitled itinerary',
        subtitle: `${duration || '—'} days · ${status || 'draft'}`,
        media,
      }
    },
  },
})
