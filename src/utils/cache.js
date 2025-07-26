// src/utils/cache.js
class CacheManager {
  constructor(defaultTTL = 300000) { // 5 minutes default
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  set(key, value, ttl = this.defaultTTL) {
    const item = {
      value,
      expiry: Date.now() + ttl
    };
    this.cache.set(key, item);
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  has(key) {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }

  // Get all valid keys
  keys() {
    const validKeys = [];
    for (const [key, item] of this.cache.entries()) {
      if (Date.now() <= item.expiry) {
        validKeys.push(key);
      } else {
        this.cache.delete(key);
      }
    }
    return validKeys;
  }

  // Clean expired items
  cleanup() {
    for (const [key, item] of this.cache.entries()) {
      if (Date.now() > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

export const cacheManager = new CacheManager();

// Auto cleanup every 5 minutes
setInterval(() => {
  cacheManager.cleanup();
}, 300000);
