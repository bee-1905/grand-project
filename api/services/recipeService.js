const Recipe = require('../models/Recipe');
const N8nService = require('./n8nService');

class RecipeService {
  async generateAndSaveRecipe(userId, cuisine, ingredients) {
    const generatedRecipe = await N8nService.generateRecipe(cuisine, ingredients);
    const recipe = new Recipe({
      userId,
      ...generatedRecipe,
    });
    return await recipe.save();
  }

  async getRecipes(userId) {
    return await Recipe.find({ userId }).sort({ createdAt: -1 });
  }

  async getRecipeById(userId, recipeId) {
    const recipe = await Recipe.findOne({ _id: recipeId, userId });
    if (!recipe) throw new Error('Recipe not found or unauthorized');
    return recipe;
  }

  async updateRecipe(userId, recipeId, updates) {
    const recipe = await Recipe.findOne({ _id: recipeId, userId });
    if (!recipe) throw new Error('Recipe not found or unauthorized');
    Object.assign(recipe, updates, { updatedAt: Date.now() });
    return await recipe.save();
  }

  async deleteRecipe(userId, recipeId) {
    const recipe = await Recipe.findOneAndDelete({ _id: recipeId, userId });
    if (!recipe) throw new Error('Recipe not found or unauthorized');
    return { message: 'Recipe deleted successfully' };
  }
}

module.exports = new RecipeService();