const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vendorDb', {useNewUrlParser: true})

module.exports = mongoose;
