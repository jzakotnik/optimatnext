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
  } catch (error) {
    const isMissing = (error as NodeJS.ErrnoException)?.code === "ENOENT";
    store = {};
    if (!isMissing) {
      // Corrupt (not just absent) — keep the bad file around for inspection
      // instead of silently discarding it, and start every source fresh.
      console.warn("[cache] store.json was corrupt, starting empty:", error);
      await fs
        .rename(CACHE_FILE, `${CACHE_FILE}.corrupt-${Date.now()}`)
        .catch(() => {});
    }
  }
}

function ensureLoaded(): Promise<void> {
  if (!loadPromise) loadPromise = load();
  return loadPromise;
}

// Serializes disk writes so two sources updating around the same time can
// never race on the same tmp file / interleave a write with a rename —
// each write is queued to see the full, latest in-memory store.
let persistQueue: Promise<void> = Promise.resolve();

/** Atomic write (tmp file + rename) so a crash mid-write never corrupts the cache. */
function persist(): Promise<void> {
  persistQueue = persistQueue.then(async () => {
    try {
      await fs.mkdir(CACHE_DIR, { recursive: true });
      const tmp = `${CACHE_FILE}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(store));
      await fs.rename(tmp, CACHE_FILE);
    } catch (error) {
      console.warn("[cache] failed to persist cache to disk:", error);
    }
  });
  return persistQueue;
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
