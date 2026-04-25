const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./db');
const authRoutes = require('./authRoutes');
const mealPlanRoutes = require('./mealPlanRoutes');
const groceryListRoutes = require('./groceryListRoutes');
const reviewRoutes = require('./reviewRoutes');
const adminRoutes = require('./adminRoutes');

const app = express();

// Cache DB connection across serverless invocations.
if (!global.__foodPlannerDbConnected) {
  connectDB();
  global.__foodPlannerDbConnected = true;
}

const configuredOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultDevOrigins = [
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

const allowedOrigins = new Set([...defaultDevOrigins, ...configuredOrigins]);

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server tools and same-origin requests without Origin header.
      if (!origin) {
        return callback(null, true);
      }

      let isVercelPreview = false;
      try {
        isVercelPreview = /\.vercel\.app$/i.test(new URL(origin).hostname);
      } catch (error) {
        isVercelPreview = false;
      }

      if (allowedOrigins.size === 0 || allowedOrigins.has(origin) || isVercelPreview) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    }
  })
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/grocery-lists', groceryListRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

module.exports = app;
