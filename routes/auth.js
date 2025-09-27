const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

// Register route (use once or protect)
router.post('/register', async (req, res) => {
  const { username, password, name } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing' });
  const exists = await AdminUser.findOne({ username });
  if (exists) return res.status(400).json({ error: 'User exists' });
  const hash = await bcrypt.hash(password, 10);
  const u = new AdminUser({ username, passwordHash: hash, name });
  await u.save();
  res.json({ ok: true });
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const u = await AdminUser.findOne({ username });
  if (!u) return res.status(401).json({ error: 'Invalid' });
  const match = await bcrypt.compare(password, u.passwordHash);
  if (!match) return res.status(401).json({ error: 'Invalid' });
  const token = jwt.sign({ id: u._id, username: u.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ ok: true, token });
});

module.exports = router;
