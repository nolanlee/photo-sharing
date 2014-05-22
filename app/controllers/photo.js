var mongoose = require('mongoose')
  , Photo = mongoose.model('Photo')
  , cloud = require('../models/cloud')
  , utils = require('../utils/utils')
  , config = require('../../config/config')
  , xss = require('xss')
  , api = {};

var editPhotoById = function(id, data, callback) {
  Photo.findByIdAndUpdate(id, data, callback);
};

// GET
api.getPhotos = function(req, res) {
  Photo.find({
    'status.deleted': false
  }, function(err, photos) {
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
    } else if(!photo || photo.status.deleted || photo.status.freeze.status) {
      res.json(404, { msg: "Photo is null" });
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
    } else if(!photo || photo.status.deleted || photo.status.freeze.status) {
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
      description: xss(req.body.description, {
        whiteList: {}
      })
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
    'status.freeze': { 
      status: true
    }
  }, function(err) {
    if(err) {
      res.send(500, err);
    } else {
      res.send(204);
    }
  });

};

// PUT
api.unfreezePhoto = function(req, res) {
  var id = req.body.id;

  editPhotoById(id, {
    'status.freeze': { 
      status: false
    }
  }, function(err) {
    if(err) {
      res.send(500, err);
    } else {
      res.send(204);
    }
  });

};

// PUT
api.complainPhoto = function(req, res) {
  var id = req.body.id;

  if(req.cookies['complained-' + id]) {
    res.json(403, { complained: true });
  } else {
    Photo.findById(id, function(err, photo) {
      if(err) {
        res.send(500, err);
      } else if (!photo || photo.status.deleted || photo.status.freeze.status) {
         res.send(500, 'Photo is null');
      } else {
        var updateData;

        if(photo.status.freeze.count < config.freezeThreshold) {
          updateData = {
            'status.freeze.count': photo.status.freeze.count + 1
          };
        } else {
          updateData = {
            'status.freeze.status': true
          };
        }

        editPhotoById(id, updateData, function(err) {
          if(err) {
            return res.json(500, { msg: 'complain failed' });
          } else {
            res.cookie('complained-' + id, true, { maxAge: 86400000, httpOnly: true });
            return res.send(204);
          }
        });
      }
    });
  }
  
};

// PUT
api.deletePhotoWithVerify = function(req, res) {
  var id = req.body.id
    , passcode = req.body.passcode;

  if(passcode) {
    Photo.findOne({_id: id, passcode: passcode}, function(err, photo) {
      if(err || !photo) {
        return res.json(500, err || { msg: 'passcode is invalid' });
      } else if( photo.status.deleted ) {
        return res.json(500, { msg: 'photo is null' });
      } else {
        api.deletePhoto(req, res);
      }
    });
  } else {
    return res.json(403, { msg: 'passcode is null' });
  }
};

// PUT
api.deletePhoto = function(req, res) {
  var id = req.body.id;

  Photo.findById(id, function(err, photo) {
    if(err || !photo) {
      return res.send(500, err || { msg: 'photo is null' });
    } else {
      var fileName = photo.url.substr(photo.url.lastIndexOf('/') + 1);

      editPhotoById(id, {
        'status.deleted': true
      }, function(err) {
        if(err) {
          return res.json(500, { msg: 'delete failed' });
        } else {
          cloud.markPhotoDeleted(fileName);
          return res.send(204);
        }
      });
    }
  });
  
};

module.exports = api;
