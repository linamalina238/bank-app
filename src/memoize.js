export function memoize(fn, options = {}) {
  const maxSize = options.maxSize || Infinity;
  const ttl = options.ttl || null;
  const policy = options.policy || "lru";

  const cache = new Map();

  const memoized = function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      const entry = cache.get(key);
      if (ttl && Date.now() - entry.timestamp > ttl) {
        cache.delete(key);
      } else {
        if (policy === "lru") {
          cache.delete(key);
          cache.set(key, entry);
        }
        return entry.value;
      }
    }

    if (cache.size >= maxSize) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }

    const result = fn(...args);
    cache.set(key, { value: result, timestamp: Date.now() });
    return result;
  };

  memoized.clear = () => cache.clear();
  return memoized;
}
