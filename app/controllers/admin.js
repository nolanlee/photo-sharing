var mongoose = require('mongoose'),
  Admin = mongoose.model('Admin'),
  Photo = mongoose.model('Photo'),
  cloud = require('../models/cloud'),
  api = {};

// GET
api.login = function(req, res) {
	var username = req.params.username,
		password = req.params.password;

	Admin.findOne({username: username, password: password}, function(err, admin) {
		if(admin) {
			res.cookie('admin', 'tobi', { maxAge: 900000, signed: true });

			res.send(200);
		} else {
			res.send(500);
		}
	});
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


