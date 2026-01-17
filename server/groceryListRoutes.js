const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const GroceryList = require('./models/GroceryList');

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

// Get all grocery lists for user
router.get('/', verifyToken, async (req, res) => {
  try {
    const groceryLists = await GroceryList.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, groceryLists });
  } catch (error) {
    console.error('Get grocery lists error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new grocery list
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, date, items } = req.body;

    if (!name || !date) {
      return res.status(400).json({ error: 'Name and date are required' });
    }

    const groceryList = new GroceryList({
      userId: req.user.id,
      name,
      date,
      items: items || []
    });

    await groceryList.save();

    res.status(201).json({
      success: true,
      message: 'Grocery list created successfully',
      groceryList
    });
  } catch (error) {
    console.error('Create grocery list error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update grocery list (rename, update date, or update items)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, date, items } = req.body;

    const groceryList = await GroceryList.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, date, items },
      { new: true, runValidators: true }
    );

    if (!groceryList) {
      return res.status(404).json({ error: 'Grocery list not found' });
    }

    res.json({
      success: true,
      message: 'Grocery list updated successfully',
      groceryList
    });
  } catch (error) {
    console.error('Update grocery list error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add item to grocery list
router.post('/:id/items', verifyToken, async (req, res) => {
  try {
    const { name, quantity, unit } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Item name is required' });
    }

    const groceryList = await GroceryList.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!groceryList) {
      return res.status(404).json({ error: 'Grocery list not found' });
    }

    groceryList.items.push({
      name,
      quantity: quantity || 1,
      unit: unit || 'pcs',
      checked: false
    });

    await groceryList.save();

    res.json({
      success: true,
      message: 'Item added successfully',
      groceryList
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add multiple items to grocery list (for recipe ingredients)
router.post('/:id/items/bulk', verifyToken, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    const groceryList = await GroceryList.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!groceryList) {
      return res.status(404).json({ error: 'Grocery list not found' });
    }

    items.forEach(item => {
      groceryList.items.push({
        name: item.name,
        quantity: item.quantity || 1,
        unit: item.unit || 'pcs',
        checked: false
      });
    });

    await groceryList.save();

    res.json({
      success: true,
      message: 'Items added successfully',
      groceryList
    });
  } catch (error) {
    console.error('Add bulk items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete grocery list
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const groceryList = await GroceryList.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!groceryList) {
      return res.status(404).json({ error: 'Grocery list not found' });
    }

    res.json({
      success: true,
      message: 'Grocery list deleted successfully'
    });
  } catch (error) {
    console.error('Delete grocery list error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
