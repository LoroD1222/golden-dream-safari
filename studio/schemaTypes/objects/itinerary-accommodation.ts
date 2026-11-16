import {HomeIcon} from '@sanity/icons/Home'
import {defineField, defineType} from 'sanity'

export const itineraryAccommodation = defineType({
  name: 'itineraryAccommodation',
  title: 'Accommodation',
  type: 'object',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Property name',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(160),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      initialValue: 'Group camping',
      options: {
        list: [
          {title: 'Group camping', value: 'Group camping'},
          {title: 'Mid-range lodge', value: 'Mid-range lodge'},
          {title: 'Private luxury', value: 'Private luxury'},
          {title: 'Other', value: 'Other'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
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
      name: 'image',
      title: 'Property image',
      type: 'image',
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
  ],
  preview: {
    select: {title: 'name', subtitle: 'category', media: 'image'},
  },
})
