const path = require('path');

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});

console.log('ENV: ', process.env.NODE_ENV);

const staticVars = {
  env: process.env.NODE_ENV,
  app_name: process.env.APP_NAME,
  version: process.env.VERSION,
  cron_schedule_1m: process.env.DEV_CRON_SCHEDULE_1MINUTE,
  cron_schedule_5m: process.env.DEV_CRON_SCHEDULE_5MINUTE,
  cron_schedule_10m: process.env.DEV_CRON_SCHEDULE_10MINUTE,
  cron_schedule_delete: process.env.DEV_CRON_DELETE_USERS,
};

const dynamicVars = {
  bodyLimit: process.env.NODE_ENV === 'production'
    ? process.env.PROD_BODY_LIMIT
    : process.env.DEV_BODY_LIMIT,
  port: process.env.NODE_ENV === 'production'
    ? process.env.PROD_PORT
    : process.env.DEV_PORT,
  mongo: {
    uri: process.env.NODE_ENV === 'production'
      ? process.env.PROD_MONGO_URI
      : process.env.DEV_MONGO_URI,
    debug: process.env.NODE_ENV === 'production'
      ? process.env.PROD_MONGO_DEBUG
      : process.env.DEV_MONGO_DEBUG,
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};


module.exports = { ...staticVars, ...dynamicVars };
