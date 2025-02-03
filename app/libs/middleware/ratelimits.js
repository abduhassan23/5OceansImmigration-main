// /app/middleware/rateLimit.js
import rateLimit from 'express-rate-limit';

export const notificationRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many requests, please try again later.',
});
