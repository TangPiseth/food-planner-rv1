const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

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

// Search meals by name
export const searchMeals = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.meals ? data.meals.map(transformMealData) : [];
  } catch (error) {
    console.error('Error searching meals:', error);
    return [];
  }
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

// Get multiple random meals for homepage/listing
export const getMultipleRandomMeals = async (count = 50) => {
  try {
    // Fetch meals by searching common letters to get variety
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'v', 'w', 'y'];
    const randomLetters = letters.sort(() => Math.random() - 0.5).slice(0, 10);
    
    const allMeals = [];
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
