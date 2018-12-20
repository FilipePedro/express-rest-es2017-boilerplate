// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { app_name: name, port, env } = require('./config/vars');
const logger = require('./config/logger');
const app = require('./config/express');
const db = require('./config/db');

// open mongoose connection
db.connect();

// listen to requests
app.listen(port, () => logger.info(`${name} started on port ${port} (${env})`));

/**
* Exports express
* @public
*/
module.exports = app;
