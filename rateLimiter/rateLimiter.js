const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Ая яй! по рукам получишь!',
});

const createUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  message: 'Лимит попыток на создание пользователя 5, попробуйте через 15 минут',
});

const loginUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  message: 'Лимит попыток на вход пользователя 5, попробуйте через 15 минут',
});

module.exports = limiter;
module.exports = createUserLimiter;
module.exports = loginUserLimiter;
