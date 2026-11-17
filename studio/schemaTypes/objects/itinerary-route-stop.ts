import {PinIcon} from '@sanity/icons/Pin'
import {defineField, defineType} from 'sanity'

export const itineraryRouteStop = defineType({
  name: 'itineraryRouteStop',
  title: 'Route stop',
  type: 'object',
  icon: PinIcon,
  fields: [
    defineField({name: 'name', title: 'Place name', type: 'string', validation: (rule) => rule.required().max(160)}),
    defineField({name: 'label', title: 'Day label', type: 'string', validation: (rule) => rule.required().max(40)}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3, validation: (rule) => rule.required().max(500)}),
    defineField({name: 'dayNumber', title: 'Day number', type: 'number', validation: (rule) => rule.required().integer().min(1).max(60)}),
    defineField({name: 'coordinates', title: 'Map coordinates', type: 'geopoint', validation: (rule) => rule.required()}),
  ],
  preview: {select: {title: 'name', subtitle: 'label'}},
})
