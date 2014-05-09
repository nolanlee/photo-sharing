var mongoose = require('mongoose'),
  Admin = mongoose.model('Admin'),
  Photo = mongoose.model('Photo'),
  cloud = require('../models/cloud'),
  api = {};

// GET
api.init = function(req, res) {
  new Admin().save(function(err) {
    if(err) {

      return res.json(500, err);

    } else {
      return res.json(201, 'init success');
    }
  });
};

// GET
api.login = function(req, res) {
	var username = req.query.username || '',
		password = req.query.password || '';

	Admin.findOne({username: username, password: password}, function(err, admin) {
		if(admin) {
			req.session.views += 1;

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

// GET
api.getPhotos = function(req, res) {

};

// PUT
api.unfreezePhotos = function(req, res) {

};

// DELETE
api.deletePhotos = function(req, res) {

};

module.exports = api;


