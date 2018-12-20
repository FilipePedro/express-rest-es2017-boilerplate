const path = require('path');

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});

console.log('ENV: ', process.env.NODE_ENV);

const staticVars = {
  app_name: process.env.APP_NAME,
  version: process.env.VERSION,
  env: process.env.NODE_ENV,
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
