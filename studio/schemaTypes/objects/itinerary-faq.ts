import {HelpCircleIcon} from '@sanity/icons/HelpCircle'
import {defineField, defineType} from 'sanity'

export const itineraryFaq = defineType({
  name: 'itineraryFaq',
  title: 'Frequently asked question',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({name: 'question', title: 'Question', type: 'string', validation: (rule) => rule.required().max(240)}),
    defineField({name: 'answer', title: 'Answer', type: 'text', rows: 5, validation: (rule) => rule.required().max(3000)}),
  ],
  preview: {select: {title: 'question', subtitle: 'answer'}},
})
