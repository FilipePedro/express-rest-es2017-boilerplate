const cron = require('node-cron');

const { CRON_SCHEDULE } = process.env;

const cronTask = (cb, schedule) => {
  console.log('cron.validate: ', schedule, cron.validate(schedule));
  const s = cron.validate(schedule) ? schedule : CRON_SCHEDULE;
  return cron.schedule(s, cb, { scheduled: true });
};

module.exports = {
  cronTask,
};
