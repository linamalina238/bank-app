function log({ level = "INFO" } = {}) {
  return function (fn) {
    return async function (req, res, next) {
      const start = Date.now();
      const timestamp = new Date().toISOString();

      try {
        if (level === "DEBUG" || level === "INFO") {
          console.log(`[${timestamp}] [${level}] ${fn.name} args:`, {
            body: req.body,
            params: req.params,
          });
        }

        const result = await fn(req, res, next);

        if (level === "DEBUG") {
          console.log(`[${timestamp}] [DEBUG] ${fn.name} result:`, result);
        }

        const duration = Date.now() - start;
        console.log(`[${timestamp}] [TIME] ${fn.name}: ${duration}ms`);

        return result;
      } catch (error) {
        console.error(`[${timestamp}] [ERROR] ${fn.name}:`, error.message);
        next(error);
      }
    };
  };
}

module.exports = { log };
