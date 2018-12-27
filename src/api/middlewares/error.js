const httpStatus = require('http-status');
const expressValidation = require('express-validation');
const APIError = require('./../utils/APIError');
const { env } = require('./../../config/vars');

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
const handler = (err, req, res, next) => {
  const {
    status,
    message,
    errors,
    stack,
  } = err;

  const response = {
    code: status,
    message: message || httpStatus[status],
    errors,
    stack,
  };

  if (env !== 'development') delete response.stack;

  res.status(status).json(response);
};

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */

const converter = (err, req, res, next) => {
  let convertedError = err;
  const {
    errors,
    message,
    status,
    stack,
  } = err;

  if (err instanceof expressValidation.ValidationError) {
    convertedError = new APIError({
      message: 'Validation Error',
      errors,
      status,
      stack,
    });
  }
  if (!(err instanceof APIError)) {
    convertedError = new APIError({
      message,
      status,
      stack,
    });
  }
  return handler(convertedError, req, res);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */

const notFound = (req, res, next) => {
  const err = new APIError({
    message: 'Not Found',
    status: httpStatus.NOT_FOUND,
  });
  return handler(err, req, res);
};

module.exports = {
  handler,
  converter,
  notFound,
};
