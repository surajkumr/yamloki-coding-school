const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  note: { type: String },
  sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
