// Review service for managing recipe reviews
const API_URL = 'http://localhost:3001/api/reviews';

/**
 * Get stored auth token
 */
const getToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Create a new review
 */
export const createReview = async (recipeId, recipeTitle, rating, comment) => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: 'Please login to submit a review' };
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ recipeId, recipeTitle, rating, comment })
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to create review' };
    }

    return { success: true, review: data.review };
  } catch (error) {
    console.error('Create review error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

/**
 * Get all reviews for a specific recipe
 */
export const getRecipeReviews = async (recipeId) => {
  try {
    const response = await fetch(`${API_URL}/recipe/${recipeId}`);
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to fetch reviews' };
    }

    return { success: true, reviews: data.reviews };
  } catch (error) {
    console.error('Get reviews error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

/**
 * Get all reviews by the current user
 */
export const getUserReviews = async () => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: 'Please login to view your reviews' };
    }

    const response = await fetch(`${API_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to fetch user reviews' };
    }

    return { success: true, reviews: data.reviews };
  } catch (error) {
    console.error('Get user reviews error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

/**
 * Update a review
 */
export const updateReview = async (reviewId, rating, comment) => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: 'Please login to update your review' };
    }

    const response = await fetch(`${API_URL}/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ rating, comment })
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to update review' };
    }

    return { success: true, review: data.review };
  } catch (error) {
    console.error('Update review error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

/**
 * Delete a review
 */
export const deleteReview = async (reviewId) => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: 'Please login to delete your review' };
    }

    const response = await fetch(`${API_URL}/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to delete review' };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete review error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

/**
 * Check if current user has reviewed a specific recipe
 */
export const checkUserReview = async (recipeId) => {
  try {
    const token = getToken();
    if (!token) {
      return { success: true, hasReviewed: false, review: null };
    }

    const response = await fetch(`${API_URL}/check/${recipeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to check review status' };
    }

    return { 
      success: true, 
      hasReviewed: data.hasReviewed, 
      review: data.review 
    };
  } catch (error) {
    console.error('Check review error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

/**
 * Get average rating for a single recipe
 */
export const getRecipeRating = async (recipeId) => {
  try {
    const response = await fetch(`${API_URL}/rating/${recipeId}`);
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to fetch rating' };
    }

    return { 
      success: true, 
      averageRating: data.averageRating, 
      totalReviews: data.totalReviews 
    };
  } catch (error) {
    console.error('Get rating error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

/**
 * Get ratings for multiple recipes at once
 */
export const getBatchRatings = async (recipeIds) => {
  try {
    const response = await fetch(`${API_URL}/ratings/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recipeIds })
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to fetch ratings' };
    }

    return { success: true, ratings: data.ratings };
  } catch (error) {
    console.error('Get batch ratings error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

export default {
  createReview,
  getRecipeReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  checkUserReview,
  getRecipeRating,
  getBatchRatings
};
