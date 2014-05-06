module.exports = function(app){

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

  app.get('/api/admin/login', Admin.login);

};
