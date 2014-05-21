var qiniu = require('qiniu')
  , appName = require('../../config/config').app.name
  , bucketname = 'photo-sharing'
  , Cloud = {};

// qiniu config
qiniu.conf.ACCESS_KEY = 'MRAdl5snFiX5o51ipBt2VxcMfHr3AANHcspH2aCc';
qiniu.conf.SECRET_KEY = 'Y1tsbVU7Krgr7it3U12lU6nPrvhsKOikTNfKPdQ-';

Cloud.getToken = function() {
  return new qiniu.rs.PutPolicy(bucketname).token();
};

Cloud.uploadPhoto = function(file, key, callback) {
  var extra = new qiniu.io.PutExtra(),
    uptoken = new qiniu.rs.PutPolicy(bucketname).token();

  qiniu.io.putFile(uptoken, key, file, extra, callback);
};

Cloud.getPhotoURL = function(key) {
  return 'http://' + bucketname + '.qiniudn.com/' + key;
};

Cloud.markPhotoDeleted = function(fileName) {
  var client = new qiniu.rs.Client();

  client.move(bucketname, fileName, bucketname, fileName + '_D', function(err, ret) {
    if (err) {
      console.log(err);
    } 
  });
};

module.exports = Cloud;