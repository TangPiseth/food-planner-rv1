const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const MealPlan = require('./models/MealPlan');

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all meal plans for user
router.get('/', verifyToken, async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ userId: req.user.id }).sort({ date: 1 });
    res.json({ success: true, mealPlans });
  } catch (error) {
    console.error('Get meal plans error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new meal plan
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, time, date } = req.body;

    if (!name || !time || !date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const mealPlan = new MealPlan({
      userId: req.user.id,
      name,
      time,
      date
    });

    await mealPlan.save();

    res.status(201).json({
      success: true,
      message: 'Meal plan created successfully',
      mealPlan
    });
  } catch (error) {
    console.error('Create meal plan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete meal plan
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    res.json({
      success: true,
      message: 'Meal plan deleted successfully'
    });
  } catch (error) {
    console.error('Delete meal plan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
