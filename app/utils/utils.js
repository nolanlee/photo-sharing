var Utils = {};

Utils.generatePasscode = function() {
  var passcode = ''
    , length = 6;

  while(length--) {
    passcode += ~~(Math.random() * 10);
  }

  return passcode;
};

Utils.generateUUID = function() {
  return require('node-uuid').v1();
};

module.exports = Utils;