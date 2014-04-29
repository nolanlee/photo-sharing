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

  Photo.findOne({'_id': id}, function(err, photo) {
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

  Photo.findOne({'_id': id}, function(err, photo) {
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
  var photo, photoPath, id = req.body.key;

  console.log(req.body);

  if(req.files.photoFile.size !== 0) {
    photo = new Photo({
      _id: id,
      url: cloud.getPhotoURL(id),
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
        photoPath = req.files.photoFile.path;

        cloud.uploadPhoto(photoPath, id, function(err) {
          if(err) {
            console.log(err);            
            return res.json(500, err);
          } else {
            return res.json(201, {
              id: id
            });
          }
        });
      }
    });
  } else {
    return res.json(404, {message: 'Photo is undefined'});
  }
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
