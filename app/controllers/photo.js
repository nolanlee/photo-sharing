var mongoose = require('mongoose')
  , Photo = mongoose.model('Photo')
  , cloud = require('../models/cloud')
  , utils = require('../utils/utils')
  , api = {};

var editPhotoById = function(id, data, callback) {
  Photo.findByIdAndUpdate(id, data, callback);
};

var freezePhoto = function(photo, callback) {

  var isFreezed = false;

  if(!photo.freeze && photo.warningDate && (Date.now() - new Date(photo.warningDate).getTime() > 8640000) ) {
    editPhotoById(photo._id, {
      freeze: true
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

  Photo.findById(id, function(err, photo) {

    if(err) {
      res.json(404, err);
    } else {
      if(photo && !photo.deleted) {
        // if someone complain photo and the complain data over one day, system should freeze the photo
        freezePhoto(photo, function(isFreezed) {
          if(isFreezed) {
            res.json(404, { msg: "Photo is null" });
          } else {            
            res.json(200, photo.toObject());
          }
        });
      } else {
        res.json(404, { msg: "Photo is null" });
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
      res.json(404, { msg: "Photo is null" });
    } else {
      res.json(200, photo.details);
    }
  });
}

// POST
api.addPhoto = function(req, res) {
  var photo
    , photoPath
    , id = mongoose.Types.ObjectId()
    , url = cloud.getPhotoURL(req.body.key)
    , passcode = utils.generatePasscode();

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
api.freezePhoto = function(req, res) {
  var id = req.body.id;

  editPhotoById(id, {
    freeze: true
  }, function(err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

// PUT
api.unfreezePhoto = function(req, res) {
  var id = req.body.id;

  Photo.findOneAndUpdate({ _id: id, freeze: true }, { freeze: false, $unset : { warningDate : ''} }, function(err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

// PUT
api.complainPhoto = function(req, res) {
  var id = req.body.id;

  Photo.findById(id, function(err, photo) {
    if(err) {
      res.send(500, err);
    } else if (!photo || photo.deleted) {
       res.send(500, 'Photo is null');
    } else if(photo.warningDate) {
      return res.send(204);
    } else {
      editPhotoById(id, {
        freeze: true,
        warningDate: new Date()
      }, function(err) {
        if(err) {
          return res.json(500, { msg: 'complain failed' });
        } else {
          return res.send(204);
        }
      });
    }
  });
  
};

// PUT
api.deletePhoto = function(req, res) {
  var id = req.body.id
    , passcode = req.body.passcode;

  if(passcode) {
    Photo.findOne({_id: id, passcode: passcode}, function(err, photo) {
      if(err || !photo) {
        return res.json(500, err || { msg: 'passcode is invalid' });
      } else if( photo.deleted) {
        return res.json(500, { msg: 'photo is null' });
      } else {
        editPhotoById(id, {
          passcode: passcode,
          deleted: true
        }, function(err) {
          if(err) {
            return res.json(500, { msg: 'delete failed' });
          } else {
            return res.send(204);
          }
        });
      }
    });
  } else {
    return res.json(500, { msg: 'passcode is null' });
  }
};

module.exports = api;
