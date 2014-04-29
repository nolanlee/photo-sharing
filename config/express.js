var express = require('express'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    multiparty = require('connect-multiparty'),
    methodOverride = require('method-override'),
    logger = require('morgan'),
    bootstrap = require('../app/controllers/bootstrap');

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

    app.get('/', bootstrap(app));

};
