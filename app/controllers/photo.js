var mongoose = require('mongoose'),
  Photo = mongoose.model('Photo'),
  cloud = require('../models/cloud'),
  utils = require('../utils/utils'),
  api = {};

// ALL
api.getPhotos = function(req, res) {
  Photo.find({ deleted: false }, '-deleted', function(err, photos) {
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

  Photo.findById(id, function(err, photo) {
    if(err) {
      res.json(404, err);
    } else if(!photo || photo.deleted) {
      res.json(404, "Photo is null");
    } else {
      res.json(200, photo.toObject());
    }
  });
};

// GET
api.getPhotoDetails = function(req, res) {
   var id = req.params.id;

  Photo.findById(id, function(err, photo) {
    if(err) {
      res.json(404, err);
    } else if(!photo || photo.deleted) {
      res.json(404, "Photo is null");
    } else {
      res.json(200, photo.details);
    }
  });
}

// POST
api.addPhoto = function(req, res) {
  var photo,
    photoPath,
    id = mongoose.Types.ObjectId(),
    url = cloud.getPhotoURL(req.body.key),
    passcode = utils.generatePasscode();

  photo = new Photo({
    _id: id, 
    url: url,
    passcode: passcode,
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
      return res.json(201, {
        id: id,
        url: url,
        passcode: passcode
      });

    }
  });
};

// DELETE
api.deletePhoto = function(req, res) {
  api.editPhoto(req, res);
};

// PUT
api.editPhoto = function(req, res) {
  var id = req.body.id,
    passcode = req.body.passcode;

  console.log(req.body);

  if(passcode) {
    Photo.findOne({_id: id, passcode: passcode}, function(err, photo) {
      if(err) {
        return res.json(500, 'passcode is invalid');
      } else if(!photo || photo.deleted) {
        return res.json(500, 'photo is null');
      } else {
        Photo.findByIdAndUpdate(id, req.body, function(err, photo) {

          if(err) {
            return res.json(500, err);
          } else {
            return res.send(204);
          }

        });
      }
    });
  } else {
    return res.json(500, 'passcode is null');
  }

};

module.exports = api;
