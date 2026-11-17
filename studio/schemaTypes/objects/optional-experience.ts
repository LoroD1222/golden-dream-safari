import {SparklesIcon} from '@sanity/icons/Sparkles'
import {defineField, defineType} from 'sanity'

export const optionalExperience = defineType({
  name: 'optionalExperience',
  title: 'Optional experience',
  type: 'object',
  icon: SparklesIcon,
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required().max(160)}),
    defineField({name: 'price', title: 'Price label', type: 'string', validation: (rule) => rule.required().max(80)}),
    defineField({name: 'note', title: 'Note', type: 'text', rows: 3, validation: (rule) => rule.required().max(600)}),
  ],
  preview: {select: {title: 'name', subtitle: 'price'}},
})
