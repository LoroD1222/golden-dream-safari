import {ImageIcon} from '@sanity/icons/Image'
import {defineField, defineType} from 'sanity'

export const goldenDreamImage = defineType({
  name: 'goldenDreamImage',
  title: 'Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      validation: (rule) => rule.required().max(180),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      validation: (rule) => rule.max(240),
    }),
  ],
  preview: {select: {title: 'alt', subtitle: 'caption', media: 'image'}},
})
