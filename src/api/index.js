const { Router } = require('express');
const httpStatus = require('http-status');
const { respondSuccess } = require('./utils/responder');
const { app_name: name, version } = require('./../config/vars');

/* ROUTERS */
const usersRouter = require('./resources/users/router');

const router = Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res, next) => res.status(httpStatus.OK).json(respondSuccess({
  name,
  version,
  service: 'ONLINE',
})));

router.use('/users', usersRouter);


module.exports = router;
