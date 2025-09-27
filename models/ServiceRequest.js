const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
  name: String,
  email: String,
  serviceType: String,
  message: String,
  attachments: [{ filename: String, url: String }],
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);
