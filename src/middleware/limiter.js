const rateLimit = require('express-rate-limit');
const HttpCode = require('../helpers/constants');

const limiter = ({ windowMs, max }) => {
  const result = rateLimit({
    windowMs,
    max,
    handler: (req, res, next) => {
      res.status(HttpCode.TOO_MANY_REQUESTS).json({
        status: 'error',
        code: HttpCode.TOO_MANY_REQUESTS,
        message:
          'Too many request from this IP, please try again after an hour',
      });
    },
  });
  return result;
};

module.exports = limiter;
