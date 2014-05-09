var session = require('cookie-session');

module.exports = function(app){

  var auth = function (req, res, next) {
    var n = req.session.views || 0;
    console.log(n + ' views');
    next();
  };
	//Photo route
	var Photo = require('../app/controllers/photo');

  app.get('/api/photos', Photo.getPhotos);
  app.get('/api/photo/:id', Photo.getPhoto);
  app.get('/api/photoDetails/:id', Photo.getPhotoDetails);
  app.post('/api/photo', Photo.addPhoto);
  app.put('/api/photo/delete/:id',  Photo.deletePhoto);
  app.put('/api/photo/complain/:id',  Photo.complainPhoto);

  //Admin route
  var Admin = require('../app/controllers/admin');

  app.get('/api/admin/init', Admin.init);

  app.get('/api/admin/login', Admin.login);
  app.get('/api/admin/logout', Admin.logout);
  app.get('/api/admin/getPhotos', Admin.getPhotos)

};
