const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const { logs, version, bodyLimit } = require('./vars');
// const error = require('');

// load api
const api = require('./../api');

/**
* Express instance
* @public
*/
const app = express();

// request logging. dev: console | production: file
app.use(morgan(logs));

// parse body params and attache them to req.body
app.use(bodyParser.json({ limit: bodyLimit }));
app.use(bodyParser.urlencoded({ extended: true, limit: bodyLimit }));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// mount api version routes
app.use(`/v${version}`, api);

// if error is not an instanceOf APIError, convert it.
// app.use(error.converter);

// catch 404 and forward to error handler
// app.use(error.notFound);

// error handler, send stacktrace only during development
// app.use(error.handler);

module.exports = app;
