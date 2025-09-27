require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const visitLogger = require('./middleware/visitLogger');

const app = express();

// Routers
const authRoutes = require('./routes/auth');
const publicationsRoutes = require('./routes/publications');
const projectsRoutes = require('./routes/projects');
const requestsRoutes = require('./routes/requests');
const subscribersRoutes = require('./routes/subscribers');
const adminRoutes = require('./routes/admin');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Log visits
app.use(visitLogger);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/publications', publicationsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/subscribers', subscribersRoutes);

// Admin routes (serve admin UI if ADMIN_PATH set)
if (process.env.ADMIN_PATH) {
  app.use(`/admin/${process.env.ADMIN_PATH}`, adminRoutes);
  // serve admin UI
  app.get(`/admin/${process.env.ADMIN_PATH}`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
  });
}

// Fallback to index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
