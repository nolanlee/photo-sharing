var qiniu = require('qiniu'),
  appName = require('../../config/config').app.name,
  bucketname = 'photo-sharing',
  Cloud = {};

// qiniu config
qiniu.conf.ACCESS_KEY = 'MRAdl5snFiX5o51ipBt2VxcMfHr3AANHcspH2aCc';
qiniu.conf.SECRET_KEY = 'Y1tsbVU7Krgr7it3U12lU6nPrvhsKOikTNfKPdQ-';

Cloud.getToken = function() {
  return new qiniu.rs.PutPolicy(bucketname).token();
};

Cloud.formatKey = function(key) {
  return appName + '/photos/' + key;
};

Cloud.uploadPhoto = function(file, key, callback) {
  var extra = new qiniu.io.PutExtra(),
    uptoken = new qiniu.rs.PutPolicy(bucketname).token();

  //extra.params = params;
  //extra.mimeType = mimeType;
  //extra.crc32 = crc32;
  //extra.checkCrc = checkCrc;

  qiniu.io.putFile(uptoken, this.formatKey(key), file, extra, callback);
};

Cloud.getPhotoURL = function(key) {
  return 'http://' + bucketname + '.qiniudn.com/' + this.formatKey(key);
};

module.exports = Cloud;