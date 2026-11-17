import {BillIcon} from '@sanity/icons/Bill'
import {defineField, defineType} from 'sanity'

export const itineraryPriceTier = defineType({
  name: 'itineraryPriceTier',
  title: 'Price tier',
  type: 'object',
  icon: BillIcon,
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required().max(120)}),
    defineField({name: 'price', title: 'Price label', type: 'string', validation: (rule) => rule.required().max(80)}),
    defineField({name: 'suffix', title: 'Price suffix', type: 'string', description: 'For example /pp/day.', validation: (rule) => rule.max(40)}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3, validation: (rule) => rule.required().max(600)}),
  ],
  preview: {select: {title: 'name', subtitle: 'price'}},
})
