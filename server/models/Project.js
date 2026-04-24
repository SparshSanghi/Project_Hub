const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  domain: String,
  requiredSkills: [String],
  teamSize: Number,
  status: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // 👇 NEW
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Project', ProjectSchema);