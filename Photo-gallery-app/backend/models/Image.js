Const mongoose = require(‘mongoose’);

Const ImageSchema = new mongoose.Schema({
  User: { type: mongoose.Schema.Types.ObjectId, ref: ‘User’, required: true },
  Filename: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

Module.exports = mongoose.model(‘Image’, ImageSchema);

