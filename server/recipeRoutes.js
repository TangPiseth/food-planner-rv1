const express = require('express');
const router = express.Router();

const { verifyToken } = require('./middleware/auth');
const Recipe = require('./models/Recipe');

const normalizeStringArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
    .filter(Boolean);
};

const parseOptionalNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const serializeRecipe = (recipe) => ({
  id: recipe._id,
  title: recipe.title,
  description: recipe.description,
  image: recipe.image,
  category: recipe.category,
  cuisine: recipe.cuisine,
  ingredients: recipe.ingredients,
  instructions: recipe.instructions,
  prepTime: recipe.prepTime,
  cookingTime: recipe.cookingTime,
  servings: recipe.servings,
  calories: recipe.calories,
  tags: recipe.tags,
  isApproved: recipe.isApproved,
  isActive: recipe.isActive,
  createdAt: recipe.createdAt,
  updatedAt: recipe.updatedAt,
  createdBy: recipe.createdBy
    ? {
        id: recipe.createdBy._id,
        username: recipe.createdBy.username
      }
    : null
});

router.get('/', async (req, res) => {
  try {
    const { search = '' } = req.query;
    const query = {
      isApproved: true,
      isActive: true
    };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const recipes = await Recipe.find(query)
      .sort({ updatedAt: -1 })
      .limit(200)
      .populate('createdBy', 'username');

    res.json({ success: true, recipes: recipes.map(serializeRecipe) });
  } catch (error) {
    console.error('Get public recipes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/mine', verifyToken, async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user.id })
      .sort({ updatedAt: -1 })
      .limit(200)
      .populate('createdBy', 'username');

    res.json({ success: true, recipes: recipes.map(serializeRecipe) });
  } catch (error) {
    console.error('Get user recipes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      isApproved: true,
      isActive: true
    }).populate('createdBy', 'username');

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({ success: true, recipe: serializeRecipe(recipe) });
  } catch (error) {
    console.error('Get recipe detail error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/submit', verifyToken, async (req, res) => {
  try {
    const {
      title,
      description = '',
      image = '',
      category = '',
      cuisine = '',
      ingredients = [],
      instructions = '',
      prepTime,
      cookingTime,
      servings,
      calories,
      tags = ''
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Recipe title is required' });
    }

    const recipe = new Recipe({
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      category: category.trim(),
      cuisine: cuisine.trim(),
      ingredients: normalizeStringArray(ingredients),
      instructions: instructions.trim(),
      tags: normalizeStringArray(tags),
      createdBy: req.user.id,
      isApproved: false,
      isActive: true
    });

    const parsedPrepTime = parseOptionalNumber(prepTime);
    const parsedCookingTime = parseOptionalNumber(cookingTime);
    const parsedServings = parseOptionalNumber(servings);
    const parsedCalories = parseOptionalNumber(calories);

    if (parsedPrepTime !== undefined) {
      recipe.prepTime = parsedPrepTime;
    }
    if (parsedCookingTime !== undefined) {
      recipe.cookingTime = parsedCookingTime;
    }
    if (parsedServings !== undefined) {
      recipe.servings = parsedServings;
    }
    if (parsedCalories !== undefined) {
      recipe.calories = parsedCalories;
    }

    await recipe.save();

    const populatedRecipe = await Recipe.findById(recipe._id).populate('createdBy', 'username');

    res.status(201).json({
      success: true,
      message: 'Recipe submitted for approval',
      recipe: serializeRecipe(populatedRecipe || recipe)
    });
  } catch (error) {
    console.error('Submit recipe error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
