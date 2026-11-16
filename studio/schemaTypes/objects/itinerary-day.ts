import {CalendarIcon} from '@sanity/icons/Calendar'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const itineraryDay = defineType({
  name: 'itineraryDay',
  title: 'Itinerary day',
  type: 'object',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'dayNumber',
      title: 'Day number',
      type: 'number',
      validation: (rule) => rule.required().integer().min(1).max(60),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(180),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().min(10).max(4000),
    }),
    defineField({
      name: 'habitat',
      title: 'Habitat',
      type: 'string',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'meals',
      title: 'Meals',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {
        list: [
          {title: 'Breakfast', value: 'Breakfast'},
          {title: 'Lunch', value: 'Lunch'},
          {title: 'Dinner', value: 'Dinner'},
        ],
      },
      validation: (rule) => rule.max(6).unique(),
    }),
    defineField({
      name: 'activities',
      title: 'Activities',
      type: 'array',
      of: [defineArrayMember({type: 'itineraryActivity'})],
      validation: (rule) => rule.max(20),
    }),
    defineField({
      name: 'accommodation',
      title: 'Accommodation',
      type: 'itineraryAccommodation',
    }),
  ],
  preview: {
    select: {dayNumber: 'dayNumber', title: 'title', media: 'accommodation.image'},
    prepare({dayNumber, title, media}) {
      return {title: `Day ${dayNumber || '—'} · ${title || 'Untitled'}`, media}
    },
  },
})
