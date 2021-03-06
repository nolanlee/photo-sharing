var express = require('express')
  , compress = require('compression')
  , multiparty = require('connect-multiparty')
  , methodOverride = require('method-override')
  , session = require('cookie-session')
  , cookie = require('cookie-parser')
  , bodyParser = require('body-parser')
  , logger = require('morgan')
  , cloud = require('../app/models/cloud')
  , utils = require('../app/utils/utils');

module.exports = function (app, config) {

  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.set('port', config.port);
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');
  app.use(logger('dev'));
  app.use(cookie());
  app.use(bodyParser());
  app.use(multiparty());
  app.use(methodOverride());
  app.use(session({
    name: config.app.name,
    keys: [config.app.name],
    maxage: config.sessionMaxAge
  }));

  app.get('/', function (req, res) {
    res.render('photo/new-photo', {
      token: cloud.getToken(),
      key: utils.generateUUID()
    });
  });

  app.get('/photo/:id', function (req, res) {
    res.render('photo/view-photo');
  });

  app.get('/admin', function (req, res) {
    res.render('admin/admin');
  });

};