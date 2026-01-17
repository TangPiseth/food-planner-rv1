const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  recipeId: {
    type: String,
    required: true
  },
  recipeTitle: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Compound index to ensure one review per user per recipe
reviewSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
