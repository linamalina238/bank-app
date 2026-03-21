export function memoize(fn, options = {}) {
  const cache = {};
  const maxSize = options.maxSize || Infinity;
  const ttl = options.ttl || null;
  let cacheSize = 0;

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache[key] !== undefined) {
      if (ttl && Date.now() - cache[key].timestamp > ttl) {
        delete cache[key];
        cacheSize--;
      } else {
        return cache[key].value;
      }
    }

    if (cacheSize >= maxSize) {
      const keys = Object.keys(cache);
      delete cache[keys[0]];
      cacheSize--;
    }

    const result = fn(...args);
    cache[key] = { value: result, timestamp: Date.now() };
    cacheSize++;
    return result;
  };
}
