const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./db');
const authRoutes = require('./authRoutes');
const mealPlanRoutes = require('./mealPlanRoutes');
const groceryListRoutes = require('./groceryListRoutes');
const reviewRoutes = require('./reviewRoutes');
const recipeRoutes = require('./recipeRoutes');
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
const isProduction = process.env.NODE_ENV === 'production';

const isPrivateIpv4Host = (hostname) => {
  const match = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.exec(hostname);
  if (!match) {
    return false;
  }

  const octets = match.slice(1).map(Number);
  const [first, second] = octets;

  if (first === 10) {
    return true;
  }

  if (first === 172 && second >= 16 && second <= 31) {
    return true;
  }

  return first === 192 && second === 168;
};

const isDevLocalOrigin = (origin) => {
  try {
    const { hostname, protocol } = new URL(origin);
    if (!/^https?:$/i.test(protocol)) {
      return false;
    }

    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return true;
    }

    return isPrivateIpv4Host(hostname);
  } catch (error) {
    return false;
  }
};

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

      const allowDevOrigin = !isProduction && isDevLocalOrigin(origin);

      if (allowedOrigins.has(origin) || isVercelPreview || allowDevOrigin) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  })
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/grocery-lists', groceryListRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

module.exports = app;
