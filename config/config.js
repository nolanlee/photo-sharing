var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

// db config
var dbconfig = {
  "db": "photo-sharing",  
  "host": "localhost",  
  // "user": "nolan",
  // "pw": "123456",
  "port": 27017
};

var port = (dbconfig.port === +dbconfig.port) ? ":" + dbconfig.port : '';
var login = (dbconfig.user && dbconfig.user.length > 0) ? dbconfig.user + ":" + dbconfig.pw + "@" : '';
var uristring =  "mongodb://" + login + dbconfig.host + port + "/" + dbconfig.db;

var mongoOptions = { db: { safe: true } };

// app config
var config = {
  development: {
    root: rootPath,
    app: {
      name: 'photo-sharing-app'
    },
    port: 3000,
    db: uristring + '-development',
    dbOptions: mongoOptions,
    uploadDir: rootPath + "/uploads"
  },

  test: {
    root: rootPath,
    app: {
      name: 'photo-sharing-app'
    },
    port: 3000,
    db: uristring + '-test',
    dbOptions: mongoOptions,
    uploadDir: rootPath + "/uploads"
  },

  production: {
    root: rootPath,
    app: {
      name: 'photo-sharing-app'
    },
    port: 3000,
    db: uristring + '-production',
    dbOptions: mongoOptions,
    uploadDir: rootPath + "/uploads"
  }
};

module.exports = config[env];
