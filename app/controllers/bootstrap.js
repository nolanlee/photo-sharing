var cloud = require('../models/cloud'),
  utils = require('../utils/utils');

module.exports = function(app) {
  return function(req, res) {

    res.render('photo/new-photo', {
      token: cloud.getToken(),
      key: utils.generateUUID()
    });

  };
};