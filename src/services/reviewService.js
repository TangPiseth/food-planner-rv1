import { getApiUrl } from './apiConfig';

const API_URL = getApiUrl('/reviews');

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

export const createReview = async (recipeId, recipeTitle, rating, comment) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ recipeId, recipeTitle, rating, comment })
    });

    const data = await safeJson(response);

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to create review' };
    }

    return { success: true, review: data.review, message: data.message };
  } catch (error) {
    console.error('Create review error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

// Backward-compatible alias used by older components.
export const submitReview = async (reviewData) => {
  return createReview(
    reviewData.recipeId,
    reviewData.recipeTitle || '',
    reviewData.rating,
    reviewData.comment
  );
};

export const getRecipeReviews = async (recipeId) => {
  try {
    const response = await fetch(`${API_URL}/recipe/${recipeId}`);
    const data = await safeJson(response);

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to fetch reviews', reviews: [] };
    }

    return { success: true, reviews: data.reviews || [] };
  } catch (error) {
    console.error('Get recipe reviews error:', error);
    return { success: false, error: 'Network error. Please try again.', reviews: [] };
  }
};

// Backward-compatible alias used by older components.
export const fetchApprovedReviews = async (recipeId) => getRecipeReviews(recipeId);

export const getUserReviews = async () => {
  try {
    const response = await fetch(`${API_URL}/user`, {
      headers: {
        ...getAuthHeader()
      }
    });

    const data = await safeJson(response);

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to fetch your reviews', reviews: [] };
    }

    return { success: true, reviews: data.reviews || [] };
  } catch (error) {
    console.error('Get user reviews error:', error);
    return { success: false, error: 'Network error. Please try again.', reviews: [] };
  }
};

export const updateReview = async (reviewId, rating, comment) => {
  try {
    const response = await fetch(`${API_URL}/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ rating, comment })
    });

    const data = await safeJson(response);

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to update review' };
    }

    return { success: true, review: data.review, message: data.message };
  } catch (error) {
    console.error('Update review error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await fetch(`${API_URL}/${reviewId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader()
      }
    });

    const data = await safeJson(response);

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to delete review' };
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error('Delete review error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

export const checkUserReview = async (recipeId) => {
  try {
    const response = await fetch(`${API_URL}/check/${recipeId}`, {
      headers: {
        ...getAuthHeader()
      }
    });

    const data = await safeJson(response);

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to check review status' };
    }

    return {
      success: true,
      hasReviewed: !!data.hasReviewed,
      review: data.review || null
    };
  } catch (error) {
    console.error('Check user review error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

export const getRecipeRating = async (recipeId) => {
  try {
    const response = await fetch(`${API_URL}/rating/${recipeId}`);
    const data = await safeJson(response);

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to fetch recipe rating' };
    }

    return {
      success: true,
      averageRating: data.averageRating || 0,
      totalReviews: data.totalReviews || 0
    };
  } catch (error) {
    console.error('Get recipe rating error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

export const getBatchRatings = async (recipeIds) => {
  try {
    const response = await fetch(`${API_URL}/ratings/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recipeIds })
    });

    const data = await safeJson(response);

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to fetch batch ratings' };
    }

    return { success: true, ratings: data.ratings || {} };
  } catch (error) {
    console.error('Get batch ratings error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

export const reportReview = async (reviewId, reason) => {
  try {
    const response = await fetch(`${API_URL}/${reviewId}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ reason })
    });

    const data = await safeJson(response);

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to report review' };
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error('Report review error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

export default {
  createReview,
  submitReview,
  getRecipeReviews,
  fetchApprovedReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  checkUserReview,
  getRecipeRating,
  getBatchRatings,
  reportReview
};
