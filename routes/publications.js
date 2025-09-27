const express = require('express');
const router = express.Router();
const Publication = require('../models/Publication');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/upload');
const sanitizeHtml = require('sanitize-html');
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

// List public publications
router.get('/', async (req, res) => {
  const q = { publishedAt: { $ne: null } };
  const items = await Publication.find(q).sort({ publishedAt: -1 }).limit(50);
  res.json(items);
});

// Get by slug
router.get('/:slug', async (req, res) => {
  const p = await Publication.findOne({ slug: req.params.slug });
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

// Create publication (admin)
router.post('/', adminAuth, upload.array('files', 10), async (req, res) => {
  try {
    const { title, summary, content, tags, author, publishedAt } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });
    const slug = slugify(title);
    const p = new Publication({
      title, slug, summary, content: sanitizeHtml(content || ''), tags: tags ? tags.split(',').map(t=>t.trim()) : [],
      author, publishedAt: publishedAt ? new Date(publishedAt) : null
    });
    // attachments
    if (req.files && req.files.length) {
      p.attachments = req.files.map(f => ({
        filename: f.originalname,
        url: '/uploads/' + f.filename,
        mimeType: f.mimetype,
        size: f.size
      }));
    }
    await p.save();
    res.json({ ok: true, publication: p });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
