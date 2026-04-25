import axios from 'axios';
import { getApiUrl } from './apiConfig';

const API_URL = getApiUrl('/grocery-lists');

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

// Get all grocery lists for logged in user
export const getGroceryLists = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader()
    });
    return response.data.groceryLists;
  } catch (error) {
    console.error('Error fetching grocery lists:', error);
    throw error;
  }
};

// Create new grocery list
export const createGroceryList = async (listData) => {
  try {
    const response = await axios.post(API_URL, listData, {
      headers: getAuthHeader()
    });
    return response.data.groceryList;
  } catch (error) {
    console.error('Error creating grocery list:', error);
    throw error;
  }
};

// Update grocery list
export const updateGroceryList = async (id, listData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, listData, {
      headers: getAuthHeader()
    });
    return response.data.groceryList;
  } catch (error) {
    console.error('Error updating grocery list:', error);
    throw error;
  }
};

// Add item to grocery list
export const addItemToList = async (listId, item) => {
  try {
    const response = await axios.post(`${API_URL}/${listId}/items`, item, {
      headers: getAuthHeader()
    });
    return response.data.groceryList;
  } catch (error) {
    console.error('Error adding item to list:', error);
    throw error;
  }
};

// Add multiple items (recipe ingredients) to grocery list
export const addRecipeToList = async (listId, items) => {
  try {
    const response = await axios.post(`${API_URL}/${listId}/items/bulk`, { items }, {
      headers: getAuthHeader()
    });
    return response.data.groceryList;
  } catch (error) {
    console.error('Error adding recipe to list:', error);
    throw error;
  }
};

// Delete grocery list
export const deleteGroceryList = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting grocery list:', error);
    throw error;
  }
};
