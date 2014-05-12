var mongoose = require('mongoose')
  , Admin = mongoose.model('Admin')
  , Photo = mongoose.model('Photo')
  , session = require('cookie-session')
  , cloud = require('../models/cloud')
  , api = {
    middleware: {}
  };

// GET
api.login = function(req, res) {
	var username = req.query.username || ''
		, password = req.query.password || '';

	Admin.findOne({username: username, password: password}, function(err, admin) {
		if(admin) {
      req.session.isLogin = true;

			res.send(200);
		} else {
			res.send(500);
		}
	});
};

// GET
api.logout = function(req, res) {
  req.session = null;

  res.json(200);
};

api.middleware.authorized = function(req, res, next) {
  if(req.session.isLogin) {
    next();
  } else {
    res.json(401, { msg: 'unauthorized' });
  }
};

module.exports = api;


