const rateLimit = require('express-rate-limit');

// Create a rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Request limit reached, please try again later.', // Message to show when the limit is exceeded
  standardHeaders: true, // Include rate limit info in response headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
});

module.exports = limiter;
