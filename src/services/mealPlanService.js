import axios from 'axios';

const API_URL = 'http://localhost:3001/api/meal-plans';

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

// Get all meal plans for logged in user
export const getMealPlans = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader()
    });
    return response.data.mealPlans;
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    throw error;
  }
};

// Create new meal plan
export const createMealPlan = async (mealData) => {
  try {
    const response = await axios.post(API_URL, mealData, {
      headers: getAuthHeader()
    });
    return response.data.mealPlan;
  } catch (error) {
    console.error('Error creating meal plan:', error);
    throw error;
  }
};

// Delete meal plan
export const deleteMealPlan = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    throw error;
  }
};
