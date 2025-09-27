const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminUser', AdminUserSchema);
