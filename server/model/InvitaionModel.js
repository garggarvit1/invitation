const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema({
  eventName: String,
  date: String,
  location: String,
  hostName: String,
  additionalInfo: String
}, { timestamps: true });

module.exports = mongoose.model('Invitation', InvitationSchema);
