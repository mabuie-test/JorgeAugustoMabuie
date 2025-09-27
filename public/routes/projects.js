const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const adminAuth = require('../middleware/adminAuth');

// List projects
router.get('/', async (req, res) => {
  const items = await Project.find().sort({ createdAt: -1 });
  res.json(items);
});

// Create project (admin)
router.post('/', adminAuth, async (req, res) => {
  const { title, description, images, tags, link } = req.body;
  const p = new Project({ title, description, images: images||[], tags: tags?tags.split(','):[], link });
  await p.save();
  res.json({ ok: true, project: p });
});

module.exports = router;
