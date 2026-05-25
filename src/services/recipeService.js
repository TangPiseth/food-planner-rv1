import { getApiUrl } from './apiConfig';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const LOCAL_API_URL = getApiUrl('/recipes');

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const safeJson = async (response) => {
  try {
    return await response.json();
  } catch (_error) {
    return {};
  }
};

const isMongoId = (value) => /^[0-9a-fA-F]{24}$/.test(String(value));

// Helper function to extract ingredients from API response
const extractIngredients = (meal) => {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`.trim());
    }
  }
  return ingredients;
};

// Helper function to transform API meal data to our format
const transformMealData = (meal) => {
  if (!meal) return null;
  
  // Generate a random rating between 3.5 and 5.0
  const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
  
  // Generate random cooking times
  const prepTime = Math.floor(Math.random() * 20) + 10;
  const cookingTime = Math.floor(Math.random() * 40) + 20;
  
  // Determine difficulty based on number of ingredients
  const ingredientCount = extractIngredients(meal).length;
  let difficulty = 'Easy';
  if (ingredientCount > 10) difficulty = 'Medium';
  if (ingredientCount > 15) difficulty = 'Hard';
  
  return {
    id: meal.idMeal,
    title: meal.strMeal,
    description: meal.strInstructions ? meal.strInstructions.substring(0, 150) + '...' : 'A delicious meal to try!',
    image: meal.strMealThumb,
    category: meal.strCategory || 'Main Course',
    course: meal.strCategory || 'Main Course',
    cuisine: meal.strArea || 'International',
    type: meal.strCategory ? meal.strCategory.toUpperCase() : 'MAIN',
    author: 'TheMealDB',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' }),
    authorImage: meal.strMealThumb,
    rating: parseFloat(rating),
    popularity: Math.floor(Math.random() * 200) + 50,
    difficulty: difficulty,
    ingredients: extractIngredients(meal),
    instructions: meal.strInstructions || 'Follow the recipe steps carefully.',
    calories: Math.floor(Math.random() * 400) + 200,
    protein: Math.floor(Math.random() * 30) + 10,
    carbohydrates: Math.floor(Math.random() * 50) + 20,
    fat: Math.floor(Math.random() * 25) + 5,
    prepTime: prepTime,
    cookingTime: cookingTime,
    servings: Math.floor(Math.random() * 4) + 2,
    chefsTips: `Try this ${meal.strArea || 'international'} dish for a flavorful experience!`,
    youtubeUrl: meal.strYoutube || null,
    source: meal.strSource || null,
    tags: meal.strTags ? meal.strTags.split(',') : [],
  };
};

const transformLocalRecipe = (recipe) => {
  if (!recipe) return null;

  const ingredientCount = Array.isArray(recipe.ingredients) ? recipe.ingredients.length : 0;
  let difficulty = 'Easy';
  if (ingredientCount > 10) difficulty = 'Medium';
  if (ingredientCount > 15) difficulty = 'Hard';

  const createdAt = recipe.createdAt ? new Date(recipe.createdAt) : new Date();

  return {
    id: recipe.id || recipe._id,
    title: recipe.title,
    description: recipe.description || 'A community recipe to try!',
    image: recipe.image || '',
    category: recipe.category || 'Community',
    course: recipe.category || 'Community',
    cuisine: recipe.cuisine || 'Community',
    type: recipe.category ? recipe.category.toUpperCase() : 'COMMUNITY',
    author: recipe.createdBy?.username || 'Community',
    date: createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' }),
    authorImage: recipe.image || '',
    rating: 0,
    popularity: 0,
    difficulty,
    ingredients: recipe.ingredients || [],
    instructions: recipe.instructions || 'Follow the recipe steps carefully.',
    calories: recipe.calories || 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    prepTime: recipe.prepTime || 0,
    cookingTime: recipe.cookingTime || 0,
    servings: recipe.servings || 1,
    chefsTips: recipe.description || '',
    youtubeUrl: null,
    source: 'local',
    tags: recipe.tags || []
  };
};

export const fetchLocalRecipes = async (search = '') => {
  try {
    const url = search
      ? `${LOCAL_API_URL}?search=${encodeURIComponent(search)}`
      : LOCAL_API_URL;
    const response = await fetch(url);
    const data = await safeJson(response);

    if (!response.ok) {
      return [];
    }

    return data.recipes ? data.recipes.map(transformLocalRecipe) : [];
  } catch (error) {
    console.error('Error fetching local recipes:', error);
    return [];
  }
};

export const fetchLocalRecipeById = async (recipeId) => {
  try {
    const response = await fetch(`${LOCAL_API_URL}/${recipeId}`);
    const data = await safeJson(response);

    if (!response.ok) {
      return null;
    }

    return data.recipe ? transformLocalRecipe(data.recipe) : null;
  } catch (error) {
    console.error('Error fetching local recipe:', error);
    return null;
  }
};

export const submitUserRecipe = async (payload) => {
  try {
    const response = await fetch(`${LOCAL_API_URL}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(payload)
    });

    const data = await safeJson(response);

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to submit recipe' };
    }

    return { success: true, recipe: data.recipe, message: data.message };
  } catch (error) {
    console.error('Submit recipe error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

export const getUserSubmittedRecipes = async () => {
  try {
    const response = await fetch(`${LOCAL_API_URL}/mine`, {
      headers: {
        ...getAuthHeader()
      }
    });

    const data = await safeJson(response);

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to load recipes', recipes: [] };
    }

    return { success: true, recipes: data.recipes || [] };
  } catch (error) {
    console.error('Get user recipes error:', error);
    return { success: false, error: 'Network error. Please try again.', recipes: [] };
  }
};

// Search meals by name
export const searchMeals = async (query) => {
  try {
    const trimmedQuery = String(query || '').trim();
    if (!trimmedQuery) {
      return [];
    }

    const [remoteRecipes, localRecipes] = await Promise.all([
      (async () => {
        const response = await fetch(`${API_BASE_URL}/search.php?s=${encodeURIComponent(trimmedQuery)}`);
        const data = await response.json();
        return data.meals ? data.meals.map(transformMealData) : [];
      })(),
      fetchLocalRecipes(trimmedQuery)
    ]);

    const combined = uniqueRecipesById([...localRecipes, ...remoteRecipes]);
    if (combined.length > 0) {
      return combined;
    }

    const fallbackTerms = getFallbackSearchTerms(trimmedQuery);
    if (fallbackTerms.length === 0) {
      return combined;
    }

    const fallbackResults = await Promise.all(
      fallbackTerms.map(async (term) => {
        const [nameResults, ingredientResults, localResults] = await Promise.all([
          (async () => {
            const response = await fetch(`${API_BASE_URL}/search.php?s=${encodeURIComponent(term)}`);
            const data = await response.json();
            return data.meals ? data.meals.map(transformMealData) : [];
          })(),
          filterByIngredient(term),
          fetchLocalRecipes(term)
        ]);

        return [...localResults, ...nameResults, ...ingredientResults];
      })
    );

    return uniqueRecipesById(fallbackResults.flat());
  } catch (error) {
    console.error('Error searching meals:', error);
    return [];
  }
};

const STOPWORDS = new Set([
  'a',
  'an',
  'and',
  'with',
  'the',
  'of',
  'in',
  'on',
  'for',
  'to',
  'style',
  'recipe',
  'dish',
  'meal',
  'grilled',
  'fried',
  'roasted',
  'baked',
  'smoked',
  'spicy',
  'crispy',
  'creamy',
  'sweet',
  'savory',
  'garlic',
  'lemon'
]);

const PRIMARY_FOODS = new Set([
  'steak',
  'shrimp',
  'chicken',
  'beef',
  'pork',
  'fish',
  'salmon',
  'tuna',
  'lamb',
  'crab',
  'lobster',
  'turkey',
  'tofu',
  'mushroom',
  'egg',
  'eggs',
  'rice',
  'pasta',
  'noodle',
  'noodles'
]);

const getFallbackSearchTerms = (query) => {
  const cleaned = String(query || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean)
    .filter((term) => !STOPWORDS.has(term));

  if (cleaned.length === 0) {
    return [];
  }

  const primary = cleaned.find((term) => PRIMARY_FOODS.has(term));
  const fallback = primary || cleaned[cleaned.length - 1];
  return fallback ? [fallback] : [];
};

// Get all meals by first letter
export const getMealsByFirstLetter = async (letter) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search.php?f=${letter}`);
    const data = await response.json();
    return data.meals ? data.meals.map(transformMealData) : [];
  } catch (error) {
    console.error('Error fetching meals by letter:', error);
    return [];
  }
};

// Fetch a single recipe by ID
export const fetchRecipe = async (recipeId) => {
  try {
    if (isMongoId(recipeId)) {
      const localRecipe = await fetchLocalRecipeById(recipeId);
      if (localRecipe) {
        return localRecipe;
      }
    }

    const response = await fetch(`${API_BASE_URL}/lookup.php?i=${recipeId}`);
    const data = await response.json();
    return data.meals && data.meals[0] ? transformMealData(data.meals[0]) : null;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
};

// Get a random meal
export const getRandomMeal = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/random.php`);
    const data = await response.json();
    return data.meals && data.meals[0] ? transformMealData(data.meals[0]) : null;
  } catch (error) {
    console.error('Error fetching random meal:', error);
    return null;
  }
};

// Get all categories
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories.php`);
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Get all areas (cuisines)
export const getAreas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/list.php?a=list`);
    const data = await response.json();
    return data.meals ? data.meals.map(item => item.strArea) : [];
  } catch (error) {
    console.error('Error fetching areas:', error);
    return [];
  }
};

export const getIngredients = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/list.php?i=list`);
    const data = await response.json();
    return data.meals ? data.meals.map(item => item.strIngredient).filter(Boolean) : [];
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return [];
  }
};

// Filter meals by category
export const filterByCategory = async (category) => {
  try {
    const response = await fetch(`${API_BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
    const data = await response.json();
    if (!data.meals) return [];
    
    // Filter endpoint returns limited data, fetch full details for each meal
    const detailedMeals = await Promise.all(
      data.meals.slice(0, 20).map(meal => fetchRecipe(meal.idMeal))
    );
    return detailedMeals.filter(meal => meal !== null);
  } catch (error) {
    console.error('Error filtering by category:', error);
    return [];
  }
};

// Filter meals by area (cuisine)
export const filterByArea = async (area) => {
  try {
    const response = await fetch(`${API_BASE_URL}/filter.php?a=${encodeURIComponent(area)}`);
    const data = await response.json();
    if (!data.meals) return [];
    
    // Filter endpoint returns limited data, fetch full details for each meal
    const detailedMeals = await Promise.all(
      data.meals.slice(0, 20).map(meal => fetchRecipe(meal.idMeal))
    );
    return detailedMeals.filter(meal => meal !== null);
  } catch (error) {
    console.error('Error filtering by area:', error);
    return [];
  }
};

// Filter meals by main ingredient
export const filterByIngredient = async (ingredient) => {
  try {
    const response = await fetch(`${API_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
    const data = await response.json();
    if (!data.meals) return [];
    
    // Filter endpoint returns limited data, fetch full details for each meal
    const detailedMeals = await Promise.all(
      data.meals.slice(0, 20).map(meal => fetchRecipe(meal.idMeal))
    );
    return detailedMeals.filter(meal => meal !== null);
  } catch (error) {
    console.error('Error filtering by ingredient:', error);
    return [];
  }
};

const normalizeFilterValue = (value) => String(value || '').trim().toLowerCase();

const uniqueRecipesById = (recipes) => {
  const map = new Map();
  recipes.filter(Boolean).forEach((recipe) => {
    if (!map.has(recipe.id)) {
      map.set(recipe.id, recipe);
    }
  });
  return Array.from(map.values());
};

const intersectRecipePools = (pools) => {
  if (pools.length === 0) {
    return [];
  }

  return pools
    .slice(1)
    .reduce((matches, pool) => {
      const ids = new Set(pool.map((recipe) => recipe.id));
      return matches.filter((recipe) => ids.has(recipe.id));
    }, pools[0]);
};

const recipeMatchesAdvancedFilters = (recipe, filters) => {
  const query = normalizeFilterValue(filters.query);
  const category = normalizeFilterValue(filters.category);
  const area = normalizeFilterValue(filters.area);
  const ingredient = normalizeFilterValue(filters.ingredient);
  const title = normalizeFilterValue(recipe.title);
  const description = normalizeFilterValue(recipe.description);
  const recipeCategory = normalizeFilterValue(recipe.category || recipe.course || recipe.type);
  const recipeArea = normalizeFilterValue(recipe.cuisine);
  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.map(normalizeFilterValue)
    : [];

  if (query && !title.includes(query) && !description.includes(query)) {
    return false;
  }

  if (category && recipeCategory !== category) {
    return false;
  }

  if (area && recipeArea !== area) {
    return false;
  }

  if (ingredient && !ingredients.some((item) => item.includes(ingredient))) {
    return false;
  }

  return true;
};

export const advancedSearchRecipes = async (filters = {}, limit = 72) => {
  const normalizedFilters = {
    query: String(filters.query || '').trim(),
    category: String(filters.category || '').trim(),
    area: String(filters.area || '').trim(),
    ingredient: String(filters.ingredient || '').trim()
  };

  const hasFilters = Object.values(normalizedFilters).some(Boolean);

  if (!hasFilters) {
    return getMultipleRandomMeals(limit);
  }

  try {
    const remoteSearches = [];

    if (normalizedFilters.query) {
      remoteSearches.push(searchMeals(normalizedFilters.query));
    }

    if (normalizedFilters.category) {
      remoteSearches.push(filterByCategory(normalizedFilters.category));
    }

    if (normalizedFilters.area) {
      remoteSearches.push(filterByArea(normalizedFilters.area));
    }

    if (normalizedFilters.ingredient) {
      remoteSearches.push(filterByIngredient(normalizedFilters.ingredient));
    }

    const [remotePools, localRecipes] = await Promise.all([
      Promise.all(remoteSearches),
      fetchLocalRecipes(normalizedFilters.query)
    ]);

    const remoteMatches = remotePools.length === 1
      ? remotePools[0]
      : intersectRecipePools(remotePools);

    const localMatches = localRecipes.filter((recipe) => recipeMatchesAdvancedFilters(recipe, normalizedFilters));

    return uniqueRecipesById([...localMatches, ...remoteMatches]).slice(0, limit);
  } catch (error) {
    console.error('Advanced recipe search error:', error);
    return [];
  }
};

// Get multiple random meals for homepage/listing
export const getMultipleRandomMeals = async (count = 50) => {
  try {
    const localRecipes = await fetchLocalRecipes();
    if (localRecipes.length >= count) {
      return localRecipes.sort(() => Math.random() - 0.5).slice(0, count);
    }
    // Fetch meals by searching common letters to get variety
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'v', 'w', 'y'];
    const randomLetters = letters.sort(() => Math.random() - 0.5).slice(0, 10);

    const allMeals = [...localRecipes];
    for (const letter of randomLetters) {
      const meals = await getMealsByFirstLetter(letter);
      allMeals.push(...meals);
      if (allMeals.length >= count) break;
    }
    
    // Shuffle and return requested count
    return allMeals.sort(() => Math.random() - 0.5).slice(0, count);
  } catch (error) {
    console.error('Error fetching multiple meals:', error);
    return [];
  }
};

// Get trending recipes (simulated - returns high-rated meals)
export const getTrendingRecipes = async (limit = 4) => {
  try {
    const meals = await getMultipleRandomMeals(10);
    return meals
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
      .map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        rating: recipe.rating,
      }));
  } catch (error) {
    console.error('Error getting trending recipes:', error);
    return [];
  }
};

// Get suggested recipes based on category or area
export const getSuggestedRecipes = async (currentRecipe, limit = 4) => {
  try {
    let suggestions = [];
    
    // Try to get recipes from same category first
    if (currentRecipe.category) {
      suggestions = await filterByCategory(currentRecipe.category);
    }
    
    // Filter out current recipe
    suggestions = suggestions.filter(r => r.id !== currentRecipe.id);
    
    // If not enough, get by area
    if (suggestions.length < limit && currentRecipe.cuisine) {
      const areaMeals = await filterByArea(currentRecipe.cuisine);
      const filteredAreaMeals = areaMeals.filter(
        r => r.id !== currentRecipe.id && !suggestions.find(s => s.id === r.id)
      );
      suggestions = [...suggestions, ...filteredAreaMeals];
    }
    
    // Shuffle and return
    return suggestions.sort(() => Math.random() - 0.5).slice(0, limit);
  } catch (error) {
    console.error('Error getting suggested recipes:', error);
    return [];
  }
};
