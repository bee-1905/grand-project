const Recipe = require('../models/Recipe');
const DatabaseManager = require('../config/database');

class RecipeRepository {
  constructor() {
    this.dbManager = DatabaseManager.getInstance();
  }

  async createRecipe(data) {
    if (this.dbManager.isMongoAvailable()) {
      return this.createRecipeMongo(data);
    } else if (this.dbManager.isSupabaseAvailable()) {
      return this.createRecipeSupabase(data);
    } else {
      throw new Error('No database available');
    }
  }

  async findRecipesByUserId(userId) {
    if (this.dbManager.isMongoAvailable()) {
      return this.findRecipesByUserIdMongo(userId);
    } else if (this.dbManager.isSupabaseAvailable()) {
      return this.findRecipesByUserIdSupabase(userId);
    } else {
      throw new Error('No database available');
    }
  }

  async findRecipeById(id, userId) {
    if (this.dbManager.isMongoAvailable()) {
      return this.findRecipeByIdMongo(id, userId);
    } else if (this.dbManager.isSupabaseAvailable()) {
      return this.findRecipeByIdSupabase(id, userId);
    } else {
      throw new Error('No database available');
    }
  }

  async updateRecipe(id, userId, updates) {
    if (this.dbManager.isMongoAvailable()) {
      return this.updateRecipeMongo(id, userId, updates);
    } else if (this.dbManager.isSupabaseAvailable()) {
      return this.updateRecipeSupabase(id, userId, updates);
    } else {
      throw new Error('No database available');
    }
  }

  async deleteRecipe(id, userId) {
    if (this.dbManager.isMongoAvailable()) {
      return this.deleteRecipeMongo(id, userId);
    } else if (this.dbManager.isSupabaseAvailable()) {
      return this.deleteRecipeSupabase(id, userId);
    } else {
      throw new Error('No database available');
    }
  }

  async searchRecipes(userId, query) {
    if (this.dbManager.isMongoAvailable()) {
      return this.searchRecipesMongo(userId, query);
    } else if (this.dbManager.isSupabaseAvailable()) {
      return this.searchRecipesSupabase(userId, query);
    } else {
      throw new Error('No database available');
    }
  }

  // MongoDB implementations
  async createRecipeMongo(data) {
    const recipe = new Recipe(data);
    const savedRecipe = await recipe.save();
    return savedRecipe.toJSON();
  }

  async findRecipesByUserIdMongo(userId) {
    const recipes = await Recipe.find({ userId }).sort({ createdAt: -1 });
    return recipes.map(recipe => recipe.toJSON());
  }

  async findRecipeByIdMongo(id, userId) {
    const recipe = await Recipe.findOne({ _id: id, userId });
    return recipe ? recipe.toJSON() : null;
  }

  async updateRecipeMongo(id, userId, updates) {
    const recipe = await Recipe.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true }
    );
    return recipe ? recipe.toJSON() : null;
  }

  async deleteRecipeMongo(id, userId) {
    const result = await Recipe.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }

  async searchRecipesMongo(userId, query) {
    const recipes = await Recipe.find({
      userId,
      $text: { $search: query }
    }).sort({ createdAt: -1 });
    
    // If no text search results, fallback to regex search
    if (recipes.length === 0) {
      const regexQuery = { $regex: query, $options: 'i' };
      const fallbackRecipes = await Recipe.find({
        userId,
        $or: [
          { title: regexQuery },
          { description: regexQuery },
          { cuisine: regexQuery },
          { tags: regexQuery }
        ]
      }).sort({ createdAt: -1 });
      
      return fallbackRecipes.map(recipe => recipe.toJSON());
    }
    
    return recipes.map(recipe => recipe.toJSON());
  }

  // Supabase implementations
  async createRecipeSupabase(data) {
    const supabase = this.dbManager.getSupabaseClient();
    
    const { data: recipe, error } = await supabase
      .from('recipes')
      .insert([{
        user_id: data.userId,
        title: data.title,
        description: data.description,
        ingredients: data.ingredients,
        instructions: data.instructions,
        prep_time: data.prepTime,
        cook_time: data.cookTime,
        servings: data.servings,
        difficulty: data.difficulty,
        cuisine: data.cuisine,
        image: data.image,
        tags: data.tags,
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create recipe: ${error.message}`);
    }

    return this.mapSupabaseToRecipe(recipe);
  }

  async findRecipesByUserIdSupabase(userId) {
    const supabase = this.dbManager.getSupabaseClient();
    
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch recipes: ${error.message}`);
    }

    return recipes ? recipes.map(recipe => this.mapSupabaseToRecipe(recipe)) : [];
  }

  async findRecipeByIdSupabase(id, userId) {
    const supabase = this.dbManager.getSupabaseClient();
    
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select()
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !recipe) {
      return null;
    }

    return this.mapSupabaseToRecipe(recipe);
  }

  async updateRecipeSupabase(id, userId, updates) {
    const supabase = this.dbManager.getSupabaseClient();
    
    const supabaseUpdates = {};
    if (updates.title) supabaseUpdates.title = updates.title;
    if (updates.description) supabaseUpdates.description = updates.description;
    if (updates.ingredients) supabaseUpdates.ingredients = updates.ingredients;
    if (updates.instructions) supabaseUpdates.instructions = updates.instructions;
    if (updates.prepTime !== undefined) supabaseUpdates.prep_time = updates.prepTime;
    if (updates.cookTime !== undefined) supabaseUpdates.cook_time = updates.cookTime;
    if (updates.servings !== undefined) supabaseUpdates.servings = updates.servings;
    if (updates.difficulty) supabaseUpdates.difficulty = updates.difficulty;
    if (updates.cuisine) supabaseUpdates.cuisine = updates.cuisine;
    if (updates.image) supabaseUpdates.image = updates.image;
    if (updates.tags) supabaseUpdates.tags = updates.tags;
    
    const { data: recipe, error } = await supabase
      .from('recipes')
      .update(supabaseUpdates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !recipe) {
      return null;
    }

    return this.mapSupabaseToRecipe(recipe);
  }

  async deleteRecipeSupabase(id, userId) {
    const supabase = this.dbManager.getSupabaseClient();
    
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    return !error;
  }

  async searchRecipesSupabase(userId, query) {
    const supabase = this.dbManager.getSupabaseClient();
    
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select()
      .eq('user_id', userId)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,cuisine.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to search recipes: ${error.message}`);
    }

    return recipes ? recipes.map(recipe => this.mapSupabaseToRecipe(recipe)) : [];
  }

  mapSupabaseToRecipe(supabaseRecipe) {
    return {
      id: supabaseRecipe.id,
      userId: supabaseRecipe.user_id,
      title: supabaseRecipe.title,
      description: supabaseRecipe.description,
      ingredients: supabaseRecipe.ingredients,
      instructions: supabaseRecipe.instructions,
      prepTime: supabaseRecipe.prep_time,
      cookTime: supabaseRecipe.cook_time,
      servings: supabaseRecipe.servings,
      difficulty: supabaseRecipe.difficulty,
      cuisine: supabaseRecipe.cuisine,
      image: supabaseRecipe.image,
      tags: supabaseRecipe.tags || [],
      createdAt: new Date(supabaseRecipe.created_at),
      updatedAt: new Date(supabaseRecipe.updated_at),
    };
  }
}

module.exports = RecipeRepository;