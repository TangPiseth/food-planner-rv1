const mongoose = require('mongoose');

const groceryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  unit: {
    type: String,
    default: 'pcs'
  },
  checked: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const groceryListSchema = new mongoose.Schema({
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
  date: {
    type: String,
    required: true
  },
  items: [groceryItemSchema]
}, {
  timestamps: true
});

const GroceryList = mongoose.model('GroceryList', groceryListSchema);

module.exports = GroceryList;
