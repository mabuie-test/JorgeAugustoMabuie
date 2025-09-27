const Visit = require('../models/Visit');

module.exports = async function (req, res, next) {
  try {
    // Don't log static asset requests
    if (req.path.startsWith('/assets') || req.path.startsWith('/uploads') || req.path.includes('.css') || req.path.includes('.js')) {
      return next();
    }
    const v = new Visit({
      ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      path: req.path,
      timestamp: new Date()
    });
    await v.save();
  } catch (err) {
    // ignore logging errors
    console.error('Visit log error', err.message);
  }
  next();
};
