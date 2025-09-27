const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest');
const upload = require('../middleware/upload');
const adminAuth = require('../middleware/adminAuth');

// public create
router.post('/', upload.array('attachments', 5), async (req, res) => {
  const { name, email, serviceType, message } = req.body;
  const r = new ServiceRequest({ name, email, serviceType, message });
  if (req.files) {
    r.attachments = req.files.map(f => ({ filename: f.originalname, url: '/uploads/' + f.filename }));
  }
  await r.save();
  res.json({ ok: true, request: r });
});

// list (admin)
router.get('/', adminAuth, async (req, res) => {
  const items = await ServiceRequest.find().sort({ createdAt: -1 }).limit(200);
  res.json(items);
});

module.exports = router;
