var mongoose = require('mongoose'),
  Photo = mongoose.model('Photo'),
  cloud = require('../models/cloud'),
  utils = require('../utils/utils'),
  api = {};

var editPhoto = function(id, data, callback) {
  Photo.findByIdAndUpdate(id, data, callback);
};

var freezePhoto = function(photo, callback) {

  var isFreezed = false;

  if(!photo.deleted && photo.warningDate && (Date.now() - new Date(photo.warningDate).getTime() > 8640000) ) {
    editPhoto(photo._id, {
      deleted: true
    }, function(err) {
      isFreezed = !err;
      callback(isFreezed);
    });
  } else {
    callback(isFreezed);
  } 

};

// ALL
api.getPhotos = function(req, res) {
  console.log(req.cookies);
  console.log(req.signedCookies);
  
  Photo.find(function(err, photos) {
    if(err) {
      res.json(500, err);
    } else {
      res.cookie('admin', 'tobi', { maxAge: 900000, signed: true });
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
    } else {
      if(photo && !photo.deleted) {
        // if someone complain photo and the complain data over one day, system should freeze the photo
        freezePhoto(photo, function(isFreezed) {
          if(isFreezed) {
            res.json(404, "Photo is null");
          } else {            
            res.json(200, photo.toObject());
          }
        });
      } else {
        res.json(404, "Photo is null");
      }
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
    details: {
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

// PUT
api.complainPhoto = function(req, res) {
  var id = req.body.id;

  Photo.findById(id, function(err, photo) {
    if(photo.warningDate) {
      return res.send(204);
    } else {
      editPhoto(id, {
        warningDate: new Date()
      }, function(err) {
        if(err) {
          return res.json(500, 'complain failed');
        } else {
          return res.send(204);
        }
      });
    }
  });
  
};

// PUT
api.deletePhoto = function(req, res) {
  var id = req.body.id,
    passcode = req.body.passcode;

  if(passcode) {
    Photo.findOne({_id: id, passcode: passcode}, function(err, photo) {
      if(err || !photo) {
        return res.json(500, err || 'passcode is invalid');
      } else if( photo.deleted) {
        return res.json(500, 'photo is null');
      } else {
        editPhoto(id, {
          passcode: passcode,
          deleted: true
        }, function(err) {
          if(err) {
            return res.json(500, 'delete failed');
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
