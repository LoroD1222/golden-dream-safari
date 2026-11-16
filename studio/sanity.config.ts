import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'goldenDreamSafaris',
  title: 'Golden Dream Safaris',
  projectId: 'iir1avhf',
  dataset: 'production',
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: '2026-11-16'}),
  ],
  schema: {types: schemaTypes},
})
