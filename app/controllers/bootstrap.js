var cloud = require('../models/cloud'),
  utils = require('../utils/utils');

module.exports = function(app) {
  return function(req, res) {
    console.log(cloud.getToken());
    console.log(cloud.formatKey(utils.generateUUID()));

    res.render('photo/new-photo', {
      token: cloud.getToken(),
      key: cloud.formatKey(utils.generateUUID())
    });

  };
};