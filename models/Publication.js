const mongoose = require('mongoose');

const AttachmentSchema = new mongoose.Schema({
  filename: String,
  url: String,
  mimeType: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now }
});

const PublicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  summary: String,
  content: String,
  tags: [String],
  author: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  publishedAt: Date,
  coverImage: String,
  attachments: [AttachmentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

module.exports = mongoose.model('Publication', PublicationSchema);
