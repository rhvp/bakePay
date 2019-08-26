mongoose = require('../config/mongoose');

const vendorSchema = new mongoose.Schema({

  full_name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  reference: {
    type: String,
    required: true
  }

})

const Vendor = mongoose.model('vendor', vendorSchema);

module.exports = Vendor
