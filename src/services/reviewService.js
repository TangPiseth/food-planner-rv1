const API_URL = 'http://localhost:3001/api/reviews';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchApprovedReviews = async (recipeId) => {
  try {
    const response = await fetch(`${API_URL}/${recipeId}`);
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to load reviews', reviews: [] };
    }

    return { success: true, reviews: data.reviews || [] };
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return { success: false, error: 'Network error. Please try again.', reviews: [] };
  }
};

export const submitReview = async (reviewData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(reviewData)
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to submit review' };
    }

    return { success: true, review: data.review, message: data.message };
  } catch (error) {
    console.error('Submit review error:', error);
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

    const data = await response.json();

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
  fetchApprovedReviews,
  submitReview,
  reportReview
};
