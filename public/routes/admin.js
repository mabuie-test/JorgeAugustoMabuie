const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Visit = require('../models/Visit');
const ServiceRequest = require('../models/ServiceRequest');
const Publication = require('../models/Publication');
const Subscriber = require('../models/Subscriber');
const Comment = require('../models/Comment');

// protected stats
router.get('/stats', adminAuth, async (req, res) => {
  const visits = await Visit.countDocuments();
  const requests = await ServiceRequest.countDocuments();
  const publications = await Publication.countDocuments();
  const subscribers = await Subscriber.countDocuments();
  res.json({ visits, requests, publications, subscribers });
});

// visits list
router.get('/visits', adminAuth, async (req, res) => {
  const items = await Visit.find().sort({ timestamp: -1 }).limit(500);
  res.json(items);
});

// requests list
router.get('/requests', adminAuth, async (req, res) => {
  const items = await ServiceRequest.find().sort({ createdAt: -1 }).limit(500);
  res.json(items);
});

// publications admin
router.get('/publications', adminAuth, async (req, res) => {
  const items = await Publication.find().sort({ createdAt: -1 }).limit(200);
  res.json(items);
});

// comments moderation
router.get('/comments', adminAuth, async (req, res) => {
  const items = await Comment.find().sort({ createdAt: -1 }).limit(200);
  res.json(items);
});

module.exports = router;
