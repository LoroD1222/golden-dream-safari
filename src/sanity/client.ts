import "server-only";

import {createClient} from "@sanity/client";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "iir1avhf",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-11-17",
  // Trip prices and publishing status must be current on every dynamic page.
  // The local repository remains the credential-free fallback if Sanity is unavailable.
  useCdn: false,
});
