import {HomeIcon} from '@sanity/icons/Home'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const goldenDreamAccommodation = defineType({
  name: 'goldenDreamAccommodation',
  title: 'Accommodation',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'details', title: 'Details', default: true},
    {name: 'media', title: 'Photos'},
    {name: 'publishing', title: 'Publishing'},
  ],
  fields: [
    defineField({name: 'legacyId', type: 'string', hidden: true, readOnly: true}),
    defineField({name: 'name', title: 'Property name', type: 'string', group: 'details', validation: (rule) => rule.required().max(180)}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', group: 'details', options: {source: 'name'}, validation: (rule) => rule.required()}),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'details',
      options: {list: ['Group camping', 'Mid-range lodge', 'Private luxury', 'Other'], layout: 'radio'},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'location', title: 'Location', type: 'string', group: 'details', validation: (rule) => rule.required().max(180)}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 5, group: 'details', validation: (rule) => rule.required().max(4000)}),
    defineField({name: 'website', title: 'Website', type: 'url', group: 'details', validation: (rule) => rule.uri({scheme: ['http', 'https']})}),
    defineField({name: 'availabilityNote', title: 'Availability note', type: 'text', rows: 3, group: 'details', validation: (rule) => rule.max(1000)}),
    defineField({name: 'images', title: 'Photos', type: 'array', group: 'media', of: [defineArrayMember({type: 'goldenDreamImage'})], validation: (rule) => rule.max(24)}),
    defineField({name: 'status', title: 'Website status', type: 'string', group: 'publishing', initialValue: 'draft', options: {list: ['draft', 'published', 'archived'], layout: 'radio'}, validation: (rule) => rule.required()}),
    defineField({name: 'order', title: 'Display order', type: 'number', group: 'publishing', initialValue: 100, validation: (rule) => rule.required().integer().min(0)}),
  ],
  preview: {
    select: {title: 'name', category: 'category', location: 'location', media: 'images.0.image'},
    prepare({title, category, location, media}) { return {title: title || 'Untitled accommodation', subtitle: [category, location].filter(Boolean).join(' · '), media} },
  },
})
