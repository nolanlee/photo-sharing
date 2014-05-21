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
  status: {
    freeze: {
      count: { type: Number, default: 0 },
      status: { type: Boolean, default: false }
    },
    deleted: { type: Boolean, default: false }
  },
  passcode: { type: String }
});

// TODO: Need other invalidation later
photoSchema.path('url').required(true, 'url is required')

mongoose.model('Photo', photoSchema);