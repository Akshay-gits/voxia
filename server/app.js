const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { requireAuth } = require('@clerk/express');
const topicRoutes = require('./routes/topicRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

dotenv.config();
const app = express();

connectDB();
// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000','https://voxia.vercel.app'],
    credentials: true
  }));
app.use(express.json());

// Public health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Protected Routes
app.use('/api/generate-topic', requireAuth(), topicRoutes);
app.use('/api/get-feedback', requireAuth(), feedbackRoutes);
app.use('/api/save-session', requireAuth(), sessionRoutes);
app.use('/api/dashboard', requireAuth(), dashboardRoutes);

// Error handling
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next(err);
});

module.exports = app;
