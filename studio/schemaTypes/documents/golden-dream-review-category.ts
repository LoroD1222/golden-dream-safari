import {TagIcon} from '@sanity/icons/Tag'
import {defineField, defineType} from 'sanity'

export const goldenDreamReviewCategory = defineType({
  name: 'goldenDreamReviewCategory',
  title: 'Review category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({name: 'legacyId', type: 'string', hidden: true, readOnly: true}),
    defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required().max(100)}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name'}, validation: (rule) => rule.required()}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3, validation: (rule) => rule.max(500)}),
    defineField({name: 'status', title: 'Website status', type: 'string', initialValue: 'published', options: {list: ['draft', 'published', 'archived'], layout: 'radio'}, validation: (rule) => rule.required()}),
    defineField({name: 'order', title: 'Display order', type: 'number', initialValue: 100, validation: (rule) => rule.required().integer().min(0)}),
  ],
  preview: {select: {title: 'name', status: 'status'}, prepare({title, status}) { return {title: title || 'Untitled category', subtitle: status} }},
})
