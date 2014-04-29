var express = require('express'),
    fs = require('fs'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    multiparty = require('connect-multiparty'),
    methodOverride = require('method-override'),
    logger = require('morgan'),
    bootstrap = require('../app/controllers/bootstrap'),
    uploadDir = require('./config').uploadDir || config.root + "/uploads";

fs.mkdir(uploadDir);

module.exports = function(app, config) {

    app.use(compress());
    app.use(express.static(config.root + '/public'));
    app.set('port', config.port);
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');
    app.use(logger('dev'));
    app.use(bodyParser());
    app.use(multiparty({ uploadDir: uploadDir, limit: "8mb" }));
    app.use(methodOverride());

    app.get('/', bootstrap(app));
    // app.get('/', function(req, res) {
    //     res.render('photo/view-photo');
    // });

    // app.get('/view/*', function(req, res) {
    //     res.render('photo/view-photo');
    // });

    // app.get('/admin', function() {
    //      res.render('admin/admin');
    // });

    // app.use(function(req, res) {
    //   res.status(404).render('404', { title: '404' });
    // });

};
