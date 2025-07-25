const express = require('express');
const RecipeRepository = require('../repositories/RecipeRepository');
const { authMiddleware } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const recipeRepository = new RecipeRepository();

// Apply auth middleware to all recipe routes
router.use(authMiddleware);

// Helper function to get cuisine image
function getCuisineImage(cuisine) {
  const cuisineImages = {
    Italian: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center",
    Mexican: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop&crop=center",
    Asian: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop&crop=center",
    American: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop&crop=center",
    Mediterranean: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop&crop=center",
    Indian: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&crop=center",
    French: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center",
    Thai: "https://images.unsplash.com/photo-1559847844-d721426d6edc?w=400&h=300&fit=crop&crop=center",
  };

  return cuisineImages[cuisine] || cuisineImages.Italian;
}

// Get all recipes for authenticated user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const recipes = await recipeRepository.findRecipesByUserId(userId);
    res.json(recipes);
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// Search recipes
router.get('/search', async (req, res) => {
  try {
    const userId = req.user.id;
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const recipes = await recipeRepository.searchRecipes(userId, query);
    res.json(recipes);
  } catch (error) {
    console.error('Search recipes error:', error);
    res.status(500).json({ error: 'Failed to search recipes' });
  }
});

// Get specific recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const recipeId = req.params.id;

    const recipe = await recipeRepository.findRecipeById(recipeId, userId);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

// Create new recipe (generate recipe)
// router.post('/', async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const formData = req.body;

//     // Validate required fields
//     if (!formData.ingredients || !formData.servings || !formData.cookTime || !formData.difficulty || !formData.cuisine) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     // Get user's existing recipes count for unique naming
//     const existingRecipes = await recipeRepository.findRecipesByUserId(userId);
//     const recipeNumber = existingRecipes.length + 1;

//     // Generate hardcoded recipe based on input (this will be replaced with n8n later)
//     const newRecipe = {
//       userId,
//       title: `Generated ${formData.cuisine} Recipe #${recipeNumber}`,
//       description: `A delicious ${formData.cuisine} recipe made with ${formData.ingredients}`,
//       ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i.length > 0),
//       instructions: [
//         "Prepare all ingredients according to the recipe requirements",
//         `Follow the ${formData.cuisine} cooking method for your chosen ingredients`,
//         `Cook for approximately ${formData.cookTime} minutes`,
//         "Season to taste and adjust cooking time as needed",
//         "Serve hot and enjoy your delicious homemade meal!"
//       ],
//       prepTime: 15,
//       cookTime: formData.cookTime,
//       servings: formData.servings,
//       difficulty: formData.difficulty,
//       cuisine: formData.cuisine,
//       image: getCuisineImage(formData.cuisine),
//       tags: ['generated', formData.cuisine.toLowerCase(), formData.difficulty.toLowerCase()],
//     };

//     const savedRecipe = await recipeRepository.createRecipe(newRecipe);
//     res.status(201).json(savedRecipe);
//   } catch (error) {
//     console.error('Create recipe error:', error);
//     res.status(500).json({ error: 'Failed to create recipe' });
//   }
// });

const axios = require('axios'); // Add this to the top of the file
require('dotenv').config(); // Ensure you have access to environment variables

function tryParseJSON(raw) {
  try {
    // Remove markdown backticks and trim
    const cleaned = raw
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    // Try JSON.parse first
    return JSON.parse(cleaned);
  } catch (e) {
    // Try fallback: regex find JSON block
    const match = raw.match(/{[\s\S]+}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const formData = req.body;

    // Validate required fields
    if (!formData.ingredients || !formData.servings || !formData.cookTime || !formData.difficulty || !formData.cuisine) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Generate prompt for Gemini
     const prompt = `
  You are a helpful recipe generator.
    
  Based on the following user input, generate a recipe with the required details in **valid JSON format**.
    
  ### Input:
  - Ingredients: ${formData.ingredients}
  - Cuisine: ${formData.cuisine}
  - Servings: ${formData.servings}
  - Cook Time: ${formData.cookTime} minutes
  - Difficulty: ${formData.difficulty}
    
  ### Output format (must be valid JSON):
  {
    "title": "string",
    "description": "string",
    "ingredients": ["string", "string", ...],
    "instructions": ["string", "string", ...]
  }
    
  Respond **only** with the JSON — no markdown, no explanations, no text outside the JSON.
  `;
    

    const geminiResponse = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          key: process.env.GEMINI_API_KEY // Store your API key in a .env file
        }
      }
    );

  const textResponse = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const parsed = tryParseJSON(textResponse);

if (!parsed || !parsed.title || !Array.isArray(parsed.ingredients)) {
  return res.status(500).json({ error: 'Invalid response from Gemini model. Please try again.' });
}


    // Final recipe object
    const newRecipe = {
      userId,
      title: parsed.title || `Generated ${formData.cuisine} Recipe`,
      description: parsed.description || `A ${formData.cuisine} dish.`,
      ingredients: parsed.ingredients || [],
      instructions: parsed.instructions || [],
      prepTime: 15,
      cookTime: formData.cookTime,
      servings: formData.servings,
      difficulty: formData.difficulty,
      cuisine: formData.cuisine,
      image: getCuisineImage(formData.cuisine),
      tags: ['generated', formData.cuisine.toLowerCase(), formData.difficulty.toLowerCase()],
    };

    const savedRecipe = await recipeRepository.createRecipe(newRecipe);
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error('Create recipe error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

// Update recipe (rename or modify)
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const recipeId = req.params.id;
    const updates = req.body;

    const updatedRecipe = await recipeRepository.updateRecipe(recipeId, userId, updates);
    
    if (!updatedRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(updatedRecipe);
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

// Delete recipe
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const recipeId = req.params.id;

    const deleted = await recipeRepository.deleteRecipe(recipeId, userId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({ success: true, message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

module.exports = router;