const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    recipeId: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    recipeTitle: {
      type: String,
      trim: true,
      default: ''
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    name: {
      type: String,
      trim: true,
      maxlength: 100,
      default: ''
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
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
      trim: true,
      maxlength: 1000
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true
    },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    moderationNote: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

reviewSchema.pre('validate', function preValidate(next) {
  if (!this.name && this.username) {
    this.name = this.username;
  }
  next();
});

// One review per user per recipe.
reviewSchema.index({ userId: 1, recipeId: 1 }, { unique: true });
reviewSchema.index({ recipeId: 1, status: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
