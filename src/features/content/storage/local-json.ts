import "server-only";

import {randomUUID} from "node:crypto";
import {mkdir, readFile, rename, writeFile} from "node:fs/promises";
import path from "node:path";
import type {AccommodationInput, AccommodationRecord, ContentRepository, Review, ReviewCategory, ReviewCategoryInput, ReviewInput, SiteSettings, SiteSettingsInput} from "@/features/content/model";
import {defaultSiteSettings} from "@/features/content/defaults";

const projectDataDirectory = path.join(process.cwd(), "data");
const dataDirectory = process.env.VERCEL ? path.join("/tmp", "golden-dream-data") : projectDataDirectory;

async function ensureFile<T>(filename: string, fallback: T) {
  await mkdir(dataDirectory, {recursive: true});
  const filePath = path.join(dataDirectory, filename);
  try { await readFile(filePath, "utf8"); }
  catch { await writeFile(filePath, `${JSON.stringify(fallback, null, 2)}\n`, "utf8"); }
  return filePath;
}

async function readJson<T>(filename: string, fallback: T) {
  const filePath = await ensureFile(filename, fallback);
  try { return JSON.parse(await readFile(filePath, "utf8")) as T; }
  catch { return fallback; }
}

async function writeJson<T>(filename: string, value: T) {
  const filePath = await ensureFile(filename, value);
  const temporary = path.join(dataDirectory, `.${filename}-${randomUUID()}.tmp`);
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporary, filePath);
}

function createRepository<T extends {id: string; createdAt: string; updatedAt: string}, TInput>(filename: string): ContentRepository<T, TInput> {
  let queue = Promise.resolve();
  const mutate = <TResult>(operation: () => Promise<TResult>) => {
    const result = queue.then(operation, operation);
    queue = result.then(() => undefined, () => undefined);
    return result;
  };
  const readAll = async () => {
    const parsed = await readJson<unknown>(filename, []);
    return Array.isArray(parsed) ? parsed as T[] : [];
  };

  return {
    async list() { return (await readAll()).sort((left, right) => ((left as {order?: number}).order ?? 0) - ((right as {order?: number}).order ?? 0) || right.updatedAt.localeCompare(left.updatedAt)); },
    async get(id) { return (await readAll()).find(item => item.id === id) || null; },
    async create(input) {
      return mutate(async () => {
        const items = await readAll();
        const now = new Date().toISOString();
        const item = {...input, id: randomUUID(), createdAt: now, updatedAt: now} as unknown as T;
        await writeJson(filename, [...items, item]);
        return item;
      });
    },
    async update(id, input) {
      return mutate(async () => {
        const items = await readAll();
        const index = items.findIndex(item => item.id === id);
        if (index < 0) return null;
        const item = {...items[index], ...input, id, updatedAt: new Date().toISOString()} as T;
        items[index] = item;
        await writeJson(filename, items);
        return item;
      });
    },
    async remove(id) {
      return mutate(async () => {
        const items = await readAll();
        const next = items.filter(item => item.id !== id);
        if (next.length === items.length) return false;
        await writeJson(filename, next);
        return true;
      });
    },
  };
}

export const localReviewRepository = createRepository<Review, ReviewInput>("reviews.json");
export const localReviewCategoryRepository = createRepository<ReviewCategory, ReviewCategoryInput>("review-categories.json");
export const localAccommodationRepository = createRepository<AccommodationRecord, AccommodationInput>("accommodations.json");

export const localSiteSettingsRepository = {
  async get(): Promise<SiteSettings> {
    const parsed = await readJson<Partial<SiteSettings>>("site-settings.json", defaultSiteSettings);
    return {
      ...defaultSiteSettings,
      ...parsed,
      company: {...defaultSiteSettings.company, ...parsed.company},
      tripDefaults: {...defaultSiteSettings.tripDefaults, ...parsed.tripDefaults},
      reviews: {...defaultSiteSettings.reviews, ...parsed.reviews},
      id: "site-settings",
    };
  },
  async save(input: SiteSettingsInput): Promise<SiteSettings> {
    const value: SiteSettings = {...input, id: "site-settings", updatedAt: new Date().toISOString()};
    await writeJson("site-settings.json", value);
    return value;
  },
};
