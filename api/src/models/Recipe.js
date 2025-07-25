const mongoose = require('mongoose');
const { Schema } = mongoose;

const RecipeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    instructions: {
      type: [String],
      required: true,
    },
    prepTime: {
      type: Number,
      required: true,
      min: 0,
    },
    cookTime: {
      type: Number,
      required: true,
      min: 0,
    },
    servings: {
      type: Number,
      required: true,
      min: 1,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    cuisine: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
RecipeSchema.index({ userId: 1, createdAt: -1 });
RecipeSchema.index({ userId: 1, title: 'text', description: 'text', cuisine: 'text' });

// Transform the output to match our interface
RecipeSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.userId = ret.userId.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Recipe', RecipeSchema);