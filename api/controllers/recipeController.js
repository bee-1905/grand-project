const RecipeService = require('../services/recipeService');

class RecipeController {
  async generateRecipe(req, res) {
    try {
      const { cuisine, ingredients } = req.body;
      const { userId } = req.user;
      if (!cuisine || !ingredients) {
        return res.status(400).json({ error: 'Cuisine and ingredients are required' });
      }
      const recipe = await RecipeService.generateAndSaveRecipe(userId, cuisine, ingredients);
      res.status(201).json(recipe);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRecipes(req, res) {
    try {
      const { userId } = req.user;
      const recipes = await RecipeService.getRecipes(userId);
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRecipeById(req, res) {
    try {
      const { userId } = req.user;
      const { id } = req.params;
      const recipe = await RecipeService.getRecipeById(userId, id);
      res.json(recipe);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateRecipe(req, res) {
    try {
      const { userId } = req.user;
      const { id } = req.params;
      const updates = req.body;
      const recipe = await RecipeService.updateRecipe(userId, id, updates);
      res.json(recipe);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async deleteRecipe(req, res) {
    try {
      const { userId } = req.user;
      const { id } = req.params;
      const result = await RecipeService.deleteRecipe(userId, id);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new RecipeController();