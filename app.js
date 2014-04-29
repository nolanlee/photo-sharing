var express = require('express'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  config = require('./config/config');

// connect database
mongoose.connect(config.db, config.dbOptions, function (err, res) {
  if(err) {
    console.log('ERROR connecting to: ' + config.db + '. ' + err);
  } else {
    console.log('Successfully connected to: ' + config.db);
  }
});

// listen db connection error status
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
  if (file.indexOf('.js') >= 0) {
    require(modelsPath + '/' + file);
  }
});

var app = express();

require('./config/express')(app, config);
require('./config/api')(app);

module.exports = app;