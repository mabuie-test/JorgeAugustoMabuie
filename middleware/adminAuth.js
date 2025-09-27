const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const adminKey = process.env.ADMIN_KEY;
  const headerKey = req.get('x-admin-key');
  if (adminKey && headerKey && headerKey === adminKey) return next();

  // JWT auth
  const authHeader = req.get('authorization');
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
