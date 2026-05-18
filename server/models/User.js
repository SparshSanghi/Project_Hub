const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  department: {
    type: String,
    default: ""
  },

  bio: {
    type: String,
    default: ""
  },

  image: {
    type: String,
    default: ""
  }

});

module.exports = mongoose.model('User', userSchema);