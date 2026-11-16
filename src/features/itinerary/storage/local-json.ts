import "server-only";

import {randomUUID} from "node:crypto";
import {mkdir, readFile, rename, writeFile} from "node:fs/promises";
import path from "node:path";
import type {Itinerary, ItineraryRepository} from "@/features/itinerary/model";

const projectDataDirectory = path.join(process.cwd(), "data");
const dataDirectory = process.env.VERCEL ? path.join("/tmp", "golden-dream-data") : projectDataDirectory;
const storePath = path.join(dataDirectory, "itineraries.json");
const seedPath = path.join(projectDataDirectory, "seed-itineraries.json");
let mutationQueue = Promise.resolve();

async function ensureStore() {
  await mkdir(dataDirectory, {recursive: true});
  try { await readFile(storePath, "utf8"); }
  catch {
    const seed = await readFile(seedPath, "utf8").catch(() => "[]");
    await writeFile(storePath, seed, "utf8");
  }
}

async function readAll(): Promise<Itinerary[]> {
  await ensureStore();
  const raw = await readFile(storePath, "utf8");
  const parsed: unknown = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed as Itinerary[] : [];
}

async function writeAll(items: Itinerary[]) {
  await ensureStore();
  const temporary = path.join(dataDirectory, `.itineraries-${randomUUID()}.tmp`);
  await writeFile(temporary, `${JSON.stringify(items, null, 2)}\n`, "utf8");
  await rename(temporary, storePath);
}

function mutate<T>(operation: () => Promise<T>) {
  const result = mutationQueue.then(operation, operation);
  mutationQueue = result.then(() => undefined, () => undefined);
  return result;
}

export const localItineraryRepository: ItineraryRepository = {
  async list() { return (await readAll()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); },
  async get(idOrSlug) { return (await readAll()).find(item => item.id === idOrSlug || item.slug === idOrSlug) || null; },
  async create(input) {
    return mutate(async () => {
      const items = await readAll();
      if (items.some(item => item.slug === input.slug)) throw new Error("An itinerary with this slug already exists.");
      const now = new Date().toISOString();
      const item: Itinerary = {...input, id: randomUUID(), createdAt: now, updatedAt: now};
      await writeAll([...items, item]);
      return item;
    });
  },
  async update(id, input) {
    return mutate(async () => {
      const items = await readAll();
      const index = items.findIndex(item => item.id === id);
      if (index < 0) return null;
      if (items.some(item => item.id !== id && item.slug === input.slug)) throw new Error("An itinerary with this slug already exists.");
      const item: Itinerary = {...items[index], ...input, id, updatedAt: new Date().toISOString()};
      items[index] = item;
      await writeAll(items);
      return item;
    });
  },
  async remove(id) {
    return mutate(async () => {
      const items = await readAll();
      const next = items.filter(item => item.id !== id);
      if (next.length === items.length) return false;
      await writeAll(next);
      return true;
    });
  },
};
