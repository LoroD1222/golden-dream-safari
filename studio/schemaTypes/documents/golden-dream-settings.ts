import {CogIcon} from '@sanity/icons/Cog'
import {defineField, defineType} from 'sanity'

export const goldenDreamSettings = defineType({
  name: 'goldenDreamSettings',
  title: 'Trip settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'company', title: 'Company', default: true},
    {name: 'tripDefaults', title: 'Trip defaults'},
    {name: 'reviews', title: 'Reviews page'},
  ],
  fields: [
    defineField({
      name: 'company',
      title: 'Company',
      type: 'object',
      group: 'company',
      fields: [
        defineField({name: 'name', title: 'Company name', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'description', title: 'Short description', type: 'text', rows: 4, validation: (rule) => rule.required()}),
        defineField({name: 'logo', title: 'Logo', type: 'goldenDreamImage'}),
        defineField({name: 'email', title: 'Email', type: 'string', validation: (rule) => rule.required().email()}),
        defineField({name: 'phone', title: 'Phone', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'whatsapp', title: 'WhatsApp URL', type: 'url', validation: (rule) => rule.required().uri({scheme: ['http', 'https']})}),
        defineField({name: 'website', title: 'Website', type: 'url', validation: (rule) => rule.required().uri({scheme: ['http', 'https']})}),
        defineField({name: 'location', title: 'Location', type: 'string', validation: (rule) => rule.required()}),
      ],
    }),
    defineField({
      name: 'tripDefaults',
      title: 'Trip defaults',
      type: 'object',
      group: 'tripDefaults',
      fields: [
        defineField({name: 'startEnd', title: 'Start and end', type: 'string'}),
        defineField({name: 'groupStyle', title: 'Group style', type: 'string'}),
        defineField({name: 'bestFor', title: 'Best for', type: 'string'}),
        defineField({name: 'priceNote', title: 'Price note', type: 'text', rows: 3}),
        defineField({name: 'maximumPriceLabel', title: 'Maximum price label', type: 'string'}),
      ],
    }),
    defineField({
      name: 'reviews',
      title: 'Reviews page',
      type: 'object',
      group: 'reviews',
      fields: [
        defineField({name: 'pageTitle', title: 'Page title', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'pageIntroduction', title: 'Page introduction', type: 'text', rows: 4, validation: (rule) => rule.required()}),
        defineField({name: 'heroImage', title: 'Hero image', type: 'goldenDreamImage'}),
        defineField({name: 'sourceName', title: 'Review source name', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'sourceUrl', title: 'Review source URL', type: 'url', validation: (rule) => rule.required().uri({scheme: ['http', 'https']})}),
        defineField({name: 'aggregateRating', title: 'Aggregate rating', type: 'number', validation: (rule) => rule.required().min(0).max(5)}),
        defineField({name: 'aggregateCount', title: 'Review count', type: 'number', validation: (rule) => rule.required().integer().min(0)}),
      ],
    }),
  ],
  preview: {prepare() { return {title: 'Trip settings', subtitle: 'Company, defaults and reviews page'} }},
})
