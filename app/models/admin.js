var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var adminSchema = new Schema({
  username: String,
  password: String
});

mongoose.model('Admin', adminSchema);