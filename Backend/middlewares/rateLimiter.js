import redis from "../Config/redis.js";

const rateLimiter = ({
  prefix,
  limit,
  windowInSeconds,
  keyGenerator,
}) => {
  return async (req, res, next) => {
    try {
      const identifier = keyGenerator(req);

      const key = `rate:${prefix}:${identifier}`;

      const current = await redis.incr(key);

      if (current === 1) {
        await redis.expire(key, windowInSeconds);
      }

      if (current > limit) {
        const retryAfter = await redis.ttl(key);

        return res.status(429).json({
          success: false,
          message: `Rate limit exceeded. Try again after ${retryAfter} seconds.`,
        });
      }

      next();
    } catch (error) {
      console.error("Rate Limiter Error:", error);
      next(error);
    }
  };
};

export default rateLimiter;