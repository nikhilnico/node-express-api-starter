/**
 * Module dependencies.
 */
const express  = require('express');
const mongoose  = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

/**
 * Load environment variables from .env file
 */
dotenv.load({ path: '.env.local' });

/**
 * Database connection using mongoose module
 */
var db = mongoose.connect('mongodb://localhost:27017/lalamove', { useNewUrlParser: true });

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 8080);
app.set('host', process.env.HOST || '127.0.0.1');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

/**
 * Routes configrations
 */
require('./routes/order')(app);

if(!module.parent){
    app.listen(app.get('port')).on('error', function(err) { });
}
console.log("App is running at http://%s:%d", app.get('host'), app.get('port'));

module.exports = app;