const { Router } = require('express');
const httpStatus = require('http-status');
const { respondSuccess } = require('./utils/responder');

/* CRON SETTINGS */
const {
  app_name: name,
  version,
  cron_schedule_1m: cronSchedule1m,
  cron_schedule_5m: cronSchedule5m,
  cron_schedule_10m: cronSchedule10m,
  cron_schedule_delete: cronScheduleDelete,
} = require('./../config/vars');

/* CRON FUNCTIONS */
const {
  testingCron,
  testingGetUserCronById,
  testingDeleteUsersCron,
} = require('./resources/cron');

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

// Starting cron process
testingCron(cronSchedule1m);
testingGetUserCronById(cronSchedule5m);
testingDeleteUsersCron(cronSchedule10m);


module.exports = router;
