const Joi = require('joi');
const User = require('./../models/User');

// GET /v1/users
const listUsers = {
  query: {
    page: Joi.number().min(1),
    perPage: Joi.number().min(1).max(100),
    // name: Joi.string(),
    // email: Joi.string(),
  },
};

// POST /v1/users
const createUser = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    name: Joi.string().max(128),
    role: Joi.string().valid(User.roles),
  },
};

// PUT /v1/users/:userId
const replaceUser = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    name: Joi.string().max(128),
    role: Joi.string().valid(User.roles),
  },
  // params: {
  //   userId: Joi.string().guid().required(),
  // },
};

// PATCH /v1/users/:userId
const updateUser = {
  body: {
    email: Joi.string().email(),
    password: Joi.string().min(6).max(128),
    name: Joi.string().max(128),
    role: Joi.string().valid(User.roles),
  },
  // params: {
  //   userId: Joi.string().guid().required(),
  // },
};

// validate if userId is objectId before load
const validateUserID = {
  params: {
    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  },
};

module.exports = {
  listUsers,
  createUser,
  replaceUser,
  updateUser,
  validateUserID,
};
