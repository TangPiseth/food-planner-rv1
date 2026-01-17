const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    type: String,
    required: true,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack']
  },
  date: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

module.exports = MealPlan;
