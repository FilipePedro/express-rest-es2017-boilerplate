const httpStatus = require('http-status');
// const { omit } = require('lodash');
const User = require('./../models/User');
const { respondSuccess } = require('./../../../utils/responder');

/**
 * Just for testing purposes
 * @public
 */
const init = async (req, res, next) => {
  res.status(httpStatus.OK).json(respondSuccess({
    router: 'USER ROUTER OK!!',
  }));
};

/**
 * Load user and append to req.
 * @public
 */
const load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
const get = (req, res, next) => {
  res.status(httpStatus.OK).json(respondSuccess({
    user: req.user.transform(),
  }));
};

module.exports = {
  init,
  load,
  get,
};
