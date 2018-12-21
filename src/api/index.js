const { Router } = require('express');
const httpStatus = require('http-status');
const { respondSuccess } = require('./utils/responder');
const { app_name: name, version } = require('./../config/vars');

const router = Router();
// const User = require('./resources/users/models/User');

/**
 * GET v1/status
 */
router.get('/status', (req, res, next) => res.status(httpStatus.OK).json(respondSuccess({
  name,
  version,
})));

module.exports = router;
