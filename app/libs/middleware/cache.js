import LRU from 'lru-cache';


const cache = new LRU({
  max: 500,
  maxAge: 1000 * 60 * 5,
});

export const getCachedResponse = (key) => {
  return cache.get(key);
};

export const setCachedResponse = (key, value) => {
  cache.set(key, value);
};

export const clearCacheByPattern = (pattern) => {
  cache.forEach((value, key) => {
    if (key.startsWith(pattern)) {
      cache.del(key);
    }
  });
};

