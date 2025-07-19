const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  ingredients: [
    {
      name: String,
      quantity: String,
    },
  ],
  instructions: {
    type: String,
    required: true,
  },
  cuisine: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Recipe', recipeSchema);