module.exports = function(app){

	//Photo route
	var Photo = require('../app/controllers/photo');

  app.get('/api/photo/:id', Photo.getPhoto);
  app.get('/api/photoDetails/:id', Photo.getPhotoDetails);
  app.post('/api/photo', Photo.addPhoto);
  app.put('/api/photo/delete',  Photo.deletePhoto);
  app.put('/api/photo/complain',  Photo.complainPhoto);

  //Admin route
  var Admin = require('../app/controllers/admin');

  app.get('/api/admin/login', Admin.login);
  app.get('/api/admin/logout', Admin.logout);
  app.get('/api/admin/getPhotos', Admin.middleware.authorized, Photo.getPhotos);
  app.put('/api/admin/freezePhoto', Admin.middleware.authorized, Photo.freezePhoto);
  app.put('/api/admin/unfreezePhoto', Admin.middleware.authorized, Photo.unfreezePhoto);

};
