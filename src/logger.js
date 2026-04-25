const levels = {
  DEBUG: 10,
  INFO: 20,
  ERROR: 30,
};

function log({ level = "INFO" } = {}) {
  return function (fn) {
    return async function (req, res, next) {
      const start = Date.now();
      const timestamp = new Date().toISOString();

      try {
        if (levels[level] <= levels.INFO) {
          console.log({
            timestamp,
            level,
            function: fn.name,
            body: req.body,
            params: req.params,
          });
        }

        const result = await fn(req, res, next);

        const duration = Date.now() - start;

        console.log({
          timestamp,
          level: "DEBUG",
          function: fn.name,
          duration: `${duration}ms`,
        });

        return result;
      } catch (error) {
        console.error({
          timestamp,
          level: "ERROR",
          function: fn.name,
          message: error.message,
        });
        next(error);
      }
    };
  };
}

module.exports = { log };
