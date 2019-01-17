const httpStatus = require('http-status');
const User = require('./../models/User');
const { respondSuccess } = require('./../../../utils/responder');

/* LOAD FAKER DATA */
// const {
//   fakerUserData,
// } = require('./../../../utils/faker');

/**
 * Load user and append to req.
 * @public
 */
const load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.user = user;
    return next();
  } catch (err) {
    return next(err);
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

/**
 * Create new user
 * @public
 */
const create = async (req, res, next) => {
  try {
    /* faker usage example */
    // const user = Object.keys(req.body).length > 0
    //   ? new User(req.body)
    //   : new User(fakerUserData());

    const user = new User(req.body);

    const savedUser = await user.save();
    res.status(httpStatus.CREATED).json(respondSuccess({
      user: savedUser.transform(),
    }));
  } catch (err) {
    next(User.checkDuplicateEmail(err));
  }
};

/**
 * Replace existing user
 * @public
 */
const replace = async (req, res, next) => {
  try {
    const { user } = req;
    const newUser = new User(req.body);
    const { _id, ...newUserObject } = newUser.toObject(); // eslint-disable-line no-unused-vars

    await user.replaceOne(newUserObject);
    const savedUser = await User.findById(user._id);

    res.status(httpStatus.OK).json(respondSuccess({
      user: savedUser.transform(),
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * Update existing user
 * @public
 */
const update = async (req, res, next) => {
  try {
    const { user } = req;
    await user.updateOne(req.body);
    const savedUser = await User.findById(user._id);
    res.status(httpStatus.OK).json(respondSuccess({
      user: savedUser.transform(),
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * (Soft) Delete user
 * @public
 */

const remove = async (req, res, next) => {
  const { user } = req;
  try {
    await user.delete();
    res.status(httpStatus.NO_CONTENT).end();
  } catch (err) {
    next(err);
  }
};

/**
 * List Users
 * @public
 */
const list = async (req, res, next) => {
  try {
    const users = await User.list(req.query);
    // console.table(users);
    res.status(httpStatus.OK).json(respondSuccess({
      users,
    }));
    // console.log(res.processTime);
    // res.render('user', { title: 'Testing PUG Template', message: 'Users List', users });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  list,
  load,
  get,
  create,
  replace,
  update,
  remove,
};
