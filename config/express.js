var express = require('express'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    multiparty = require('connect-multiparty'),
    methodOverride = require('method-override'),
    logger = require('morgan'),
    cloud = require('../app/models/cloud'),
    cookieParser = require('cookie-parser'),
    utils = require('../app/utils/utils');

module.exports = function(app, config) {

    app.use(compress());
    app.use(express.static(config.root + '/public'));
    app.set('port', config.port);
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');
    app.use(logger('dev'));
    app.use(bodyParser());
    app.use(multiparty());
    app.use(methodOverride());
    app.use(cookieParser('secret'));

    app.get('/', function(req, res) {
        //TODO clicet request token and key by AJAX
        res.render('photo/new-photo', {
          token: cloud.getToken(),
          key: utils.generateUUID()
        });
    });

    app.get('/photo', function(req, res) {
        res.render('photo/view-photo');
    });

};
