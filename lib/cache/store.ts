import { promises as fs } from "fs";
import path from "path";
import { CacheEntry, CacheStore, emptyEntry } from "./types";

const CACHE_DIR = path.join(process.cwd(), ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "store.json");

let store: CacheStore = {};
let loadPromise: Promise<void> | null = null;

async function load(): Promise<void> {
  try {
    const raw = await fs.readFile(CACHE_FILE, "utf-8");
    store = JSON.parse(raw) as CacheStore;
  } catch {
    // No cache file yet (first run) or it's corrupt — start empty rather than crash.
    store = {};
  }
}

function ensureLoaded(): Promise<void> {
  if (!loadPromise) loadPromise = load();
  return loadPromise;
}

/** Atomic write (tmp file + rename) so a crash mid-write never corrupts the cache. */
async function persist(): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const tmp = `${CACHE_FILE}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(store));
    await fs.rename(tmp, CACHE_FILE);
  } catch (error) {
    console.warn("[cache] failed to persist cache to disk:", error);
  }
}

export async function getAll(): Promise<CacheStore> {
  await ensureLoaded();
  return store;
}

export async function getEntry<T>(key: string): Promise<CacheEntry<T>> {
  await ensureLoaded();
  return (store[key] as CacheEntry<T>) ?? emptyEntry<T>();
}

export async function setSuccess<T>(key: string, data: T): Promise<void> {
  await ensureLoaded();
  store[key] = { data, updatedAt: Date.now(), stale: false, error: null };
  await persist();
}

export async function setFailure(key: string, error: string): Promise<void> {
  await ensureLoaded();
  const prev: CacheEntry | undefined = store[key];
  store[key] = {
    data: prev?.data ?? null,
    updatedAt: prev?.updatedAt ?? null,
    stale: true,
    error,
  };
  await persist();
}

export type { CacheEntry, CacheStore };
