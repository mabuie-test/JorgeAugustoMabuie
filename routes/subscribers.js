const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

// subscribe
router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  try {
    const s = new Subscriber({ email });
    await s.save();
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: 'Already subscribed' });
  }
});

module.exports = router;
