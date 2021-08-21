const HttpCode = require('./constants');
const internalServerError = (err, req, res, next) => {
  err.status = err.status ? err.status : HttpCode.INTERNAL_SERVER_ERROR;
  res.status(err.status).json({
    status: err.status === HttpCode.INTERNAL_SERVER_ERROR ? 'fail' : 'error',
    code: err.status,
    message: err.message,
    data:
      err.status === HttpCode.INTERNAL_SERVER_ERROR
        ? 'Internal Server Error'
        : err.data,
  });
};

module.exports = internalServerError;
