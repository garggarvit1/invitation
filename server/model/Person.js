const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
  name: String,
  age: Number,
  bio: String,
  skills: [String],
});

module.exports = mongoose.model('Person', PersonSchema);
