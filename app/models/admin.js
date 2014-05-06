var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var adminSchema = new Schema({
  username: { type: String, default: 'admin' },
  password: { type: String, default: 'admin' }
});

mongoose.model('Admin', adminSchema);