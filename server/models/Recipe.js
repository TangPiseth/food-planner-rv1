const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    image: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      trim: true,
      default: ''
    },
    cuisine: {
      type: String,
      trim: true,
      default: ''
    },
    ingredients: {
      type: [String],
      default: []
    },
    instructions: {
      type: String,
      trim: true,
      default: ''
    },
    prepTime: {
      type: Number,
      min: 0,
      default: 0
    },
    cookingTime: {
      type: Number,
      min: 0,
      default: 0
    },
    servings: {
      type: Number,
      min: 1,
      default: 1
    },
    calories: {
      type: Number,
      min: 0,
      default: 0
    },
    tags: {
      type: [String],
      default: []
    },
    isApproved: {
      type: Boolean,
      default: false,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
