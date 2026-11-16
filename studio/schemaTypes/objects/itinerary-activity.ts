import {ClockIcon} from '@sanity/icons/Clock'
import {defineField, defineType} from 'sanity'

export const itineraryActivity = defineType({
  name: 'itineraryActivity',
  title: 'Activity',
  type: 'object',
  icon: ClockIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(160),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().min(10).max(4000),
    }),
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string',
      description: 'Optional time or time range, for example “08:30” or “Morning”.',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (rule) => rule.max(160),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'time'},
  },
})
