import fs from "fs";
import path from "path";

const CACHE_FILE = path.resolve("./cache.json");

type PageData = {
  recentReviews?: any[];
  featuredBusiness?: any;
  statistics?: any;
  categories?: any;
};

// type PageData = any;

class PageCache {
  private pageData: PageData = {};
  private isInitialized = false;

  constructor(initialData?: PageData) {
    if (initialData) {
      this.pageData = initialData;
      this.isInitialized = true;
    }
  }

  setData(data: PageData) {
    this.pageData = data;
    persistCache();
  }

  getData() {
    return this.pageData;
  }

  initializeOnce(data: PageData) {
    if (!this.isInitialized) {
      this.pageData = data;
      this.isInitialized = true;
      persistCache();
    }
  }
}

/*
--------------------------------------------------
In-memory cache store
--------------------------------------------------
*/

const cacheStore = new Map<string, PageCache>();

/*
--------------------------------------------------
Load cache.json on server start
--------------------------------------------------
*/

function loadCacheFromDisk() {
  try {
    if (!fs.existsSync(CACHE_FILE)) {
      fs.writeFileSync(CACHE_FILE, JSON.stringify({}, null, 2));
      return;
    }

    const raw = fs.readFileSync(CACHE_FILE, "utf-8");
    const parsed = JSON.parse(raw);

    for (const key of Object.keys(parsed)) {
      cacheStore.set(key, new PageCache(parsed[key]));
    }

    console.log("cache.json loaded into memory");
  } catch (err) {
    console.error("Failed to load cache.json", err);
  }
}

/*
--------------------------------------------------
Persist memory cache → disk
--------------------------------------------------
*/

function persistCache() {
  try {
    const obj: Record<string, any> = {};

    for (const [key, cache] of cacheStore.entries()) {
      obj[key] = cache.getData();
    }

    fs.writeFileSync(CACHE_FILE, JSON.stringify(obj, null, 2));
  } catch (err) {
    console.error("Failed to persist cache.json", err);
  }
}

/*
--------------------------------------------------
Public API
--------------------------------------------------
*/

export function getOrCreateCache(key: string): PageCache {
  if (!cacheStore.has(key)) {
    cacheStore.set(key, new PageCache());
    console.log(`created cache: ${key}`);
  }

  return cacheStore.get(key)!;
}

export function deleteCache(key: string): boolean {
  const deleted = cacheStore.delete(key);

  if (deleted) {
    console.log(`deleted cache: ${key}`);
    persistCache();
  } else {
    console.log(`cache not found: ${key}`);
  }

  return deleted;
}

export function getAllCacheKeys() {
  return [...cacheStore.keys()];
}

/*
--------------------------------------------------
Initialize cache when server starts
--------------------------------------------------
*/

loadCacheFromDisk();
