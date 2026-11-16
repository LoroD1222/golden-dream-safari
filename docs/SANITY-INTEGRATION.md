# Sanity integration

The website already has a server-only Sanity repository adapter. The UI, route handlers, generated PDFs and public trip pages depend on the repository interface rather than the storage implementation.

## Recommended schema

Create a `goldenDreamItinerary` document in the Sanity Studio. This outline matches the implemented TypeScript and validation model:

```ts
import {defineArrayMember, defineField, defineType} from "sanity";

export const goldenDreamItinerary = defineType({
  name: "goldenDreamItinerary",
  title: "Golden Dream itinerary",
  type: "document",
  fields: [
    defineField({name: "title", type: "string", validation: rule => rule.required()}),
    defineField({name: "slug", type: "slug", options: {source: "title"}, validation: rule => rule.required()}),
    defineField({name: "summary", type: "text", rows: 4, validation: rule => rule.required()}),
    defineField({name: "heroImage", type: "string", description: "Public image path or absolute URL"}),
    defineField({name: "durationDays", type: "number", validation: rule => rule.required().integer().min(1)}),
    defineField({name: "destinations", type: "array", of: [defineArrayMember({type: "string"})], validation: rule => rule.required().min(1)}),
    defineField({name: "startingPrice", type: "number", validation: rule => rule.min(0)}),
    defineField({name: "currency", type: "string", initialValue: "USD", validation: rule => rule.required().length(3)}),
    defineField({name: "status", type: "string", initialValue: "draft", options: {list: ["draft", "published"]}, validation: rule => rule.required()}),
    defineField({
      name: "days",
      type: "array",
      validation: rule => rule.required().min(1),
      of: [defineArrayMember({
        type: "object",
        name: "itineraryDay",
        fields: [
          defineField({name: "id", type: "string", validation: rule => rule.required()}),
          defineField({name: "dayNumber", type: "number", validation: rule => rule.required().integer().min(1)}),
          defineField({name: "title", type: "string", validation: rule => rule.required()}),
          defineField({name: "summary", type: "text", validation: rule => rule.required()}),
          defineField({name: "habitat", type: "string"}),
          defineField({name: "meals", type: "array", of: [defineArrayMember({type: "string"})]}),
          defineField({
            name: "activities",
            type: "array",
            of: [defineArrayMember({type: "object", fields: [
              defineField({name: "id", type: "string", validation: rule => rule.required()}),
              defineField({name: "title", type: "string", validation: rule => rule.required()}),
              defineField({name: "description", type: "text", validation: rule => rule.required()}),
              defineField({name: "time", type: "string"}),
              defineField({name: "location", type: "string"}),
            ]})],
          }),
          defineField({
            name: "accommodation",
            type: "object",
            fields: [
              defineField({name: "name", type: "string", validation: rule => rule.required()}),
              defineField({name: "category", type: "string", options: {list: ["Group camping", "Mid-range lodge", "Private luxury", "Other"]}, validation: rule => rule.required()}),
              defineField({name: "location", type: "string", validation: rule => rule.required()}),
              defineField({name: "description", type: "text", validation: rule => rule.required()}),
              defineField({name: "image", type: "string"}),
            ],
          }),
        ],
        preview: {select: {title: "title", subtitle: "summary"}},
      })],
    }),
    defineField({name: "inclusions", type: "array", of: [defineArrayMember({type: "string"})]}),
    defineField({name: "exclusions", type: "array", of: [defineArrayMember({type: "string"})]}),
  ],
  preview: {select: {title: "title", subtitle: "status"}},
});
```

Register the schema in the Studio’s `schema.types` array.

## Adapter behavior

`src/features/itinerary/storage/sanity.ts`:

- Pins an API version.
- Disables the CDN for editor consistency.
- Keeps tokens server-only.
- Projects Sanity `_id`, `_createdAt` and `_updatedAt` into the shared itinerary model.
- Normalizes Sanity array `_key` values to the shared day and activity IDs and writes stable `_key` values back on mutation.
- Resolves public records by document ID or slug.
- Rejects duplicate slugs and distinguishes a missing delete target from a successful delete.
- Uses explicit create, patch and delete mutations.

## Enable Sanity storage

1. Create the schema above and deploy the Studio schema.
2. Create a dedicated token with only the dataset permissions needed for this editor.
3. Add the Sanity environment variables from `.env.example`.
4. Set `ITINERARY_STORAGE=sanity`.
5. Configure Basic Auth for `/admin/itineraries` and `/api/itineraries/*`.
6. Recreate the local seed in Sanity through the editor or a one-time migration script.
7. Verify list, create, update, public detail, PDF and delete flows in a non-production dataset before switching production.

## Production notes

- Keep `SANITY_API_WRITE_TOKEN` out of client components and `NEXT_PUBLIC_` variables.
- Use `SANITY_API_READ_TOKEN` for a private dataset when public server routes need authenticated reads. The adapter falls back to the write token for compatibility, but separate least-privilege tokens are recommended.
- Restrict CORS to the Studio and deployed website origins.
- Add preview/draft handling as a separate authenticated feature rather than exposing drafts on public routes.
- Prefer Sanity image fields plus the image URL builder if image editing will move into Studio; the current string field deliberately preserves compatibility with the exported Figma assets.
