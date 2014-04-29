var mongoose = require('mongoose'),
  Photo = mongoose.model('Photo'),
  cloud = require('../models/cloud'),
  api = {};

// ALL
api.getPhotos = function(req, res) {
  Photo.find(function(err, photos) {
    if(err) {
      res.json(500, err);
    } else {
      res.json({
        photos: photos
      });
    }
  });
};

// GET
api.getPhoto = function(req, res) {
  var id = req.params.id;

  Photo.findOne({'id': id}, function(err, photo) {
    if(err) {
      res.json(404, err);
    } else if(!photo) {
      res.json(404, "Photo is null");
    } else {
      res.json(500, { url: photo.url });
    }
  });
};

// GET
api.getPhotoDetails = function(req, res) {
   var id = req.params.id;

  Photo.findOne({'id': id}, function(err, photo) {
    if(err) {
      res.json(404, err);
    } else if(!photo) {
      res.json(404, "Photo is null");
    } else {
      res.json(200, photo.details);
    }
  });
}

// POST
api.addPhoto = function(req, res) {
  var photo, photoPath, id = req.body.key, url = cloud.getPhotoURL(id);

  photo = new Photo({
    id: id,
    url: url,
    // url: req.files.photoFile.path,
    details: {
      // author: req.body.author,                        // To confirm if necessarey
      location: {
        latitude: +JSON.parse(req.body.location).latitude,
        longitude: +JSON.parse(req.body.location).longitude
      },
      description: req.body.description
    }
  });

  photo.save(function(err) {
    if(err) {

      return res.json(500, err);

    } else {
      console.log('save success!');

      return res.json(201, {
        url: url
      });

    }
  });
};

// PUT
api.editPhoto = function(req, res) {
  var id = req.params.id;

  Photo.findById(id, function(err, photo) {
    // do something
    res.json(404, {message: 'The api do nothing'});
  });
};

// DELETE
api.deletePhoto = function(req, res) {
  var id = req.params.id;

  return Photo.findById(id, function(err, photo) {

    return photo.remove(function(err) {
      if(err) {
        return res.json(500, err);
      } else {
        return res.send(204);
      }
    });

  });
}

module.exports = api;
