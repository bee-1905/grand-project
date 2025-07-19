const express = require('express');
const router = express.Router();
const RecipeController = require('../controllers/recipeController');
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.post('/generate', authenticate, RecipeController.generateRecipe);
router.get('/', authenticate, RecipeController.getRecipes);
router.get('/:id', authenticate, RecipeController.getRecipeById);
router.put('/:id', authenticate, RecipeController.updateRecipe);
router.delete('/:id', authenticate, RecipeController.deleteRecipe);

module.exports = router;