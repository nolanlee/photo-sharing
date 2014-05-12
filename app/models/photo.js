var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var photoSchema = new Schema({
  url: String,
  details: {
    created_date: { type: Date, default: Date.now },
    description: { type: String },
    location: {
      latitude: Number,
      longitude: Number
    }
  },
  passcode: { type: String },
  freeze: { type: Boolean, default: false },
  warningDate: Date,
  deleted: { type: Boolean, default: false }
});

// TODO: Need other invalidation later
photoSchema.path('url').required(true, 'url is required')

mongoose.model('Photo', photoSchema);