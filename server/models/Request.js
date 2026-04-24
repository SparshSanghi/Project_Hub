const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Request', RequestSchema);