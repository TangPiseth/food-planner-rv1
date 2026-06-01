import { getApiUrl } from './apiConfig';

const API_URL = getApiUrl('/admin');

const getAuthToken = () => localStorage.getItem('authToken');

const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (url, options = {}) => {
  if (!getAuthToken()) {
    throw new Error('No authentication token found. Please log in again.');
  }

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...getAuthHeader(),
      ...(options.headers || {})
    },
    ...options
  });

  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const text = await response.text();
    if (!response.ok) {
      throw new Error(text || 'Request failed');
    }
    throw new Error('Unexpected non-JSON response from API. Check that the server is running.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
};

export const getAdminUsers = async () => {
  const data = await request(`${API_URL}/users`);
  return data.users || [];
};

export const updateUserRole = async (userId, role, reason = '') => {
  const data = await request(`${API_URL}/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role, reason })
  });
  return data.user;
};

export const updateUserBanStatus = async (userId, isBanned, reason = '') => {
  const data = await request(`${API_URL}/users/${userId}/ban`, {
    method: 'PATCH',
    body: JSON.stringify({ isBanned, reason })
  });
  return data.user;
};

export const createAdminUser = async (payload) => {
  const data = await request(`${API_URL}/users`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return data.user;
};

export const updateAdminUser = async (userId, payload) => {
  const data = await request(`${API_URL}/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
  return data.user;
};

export const deleteAdminUser = async (userId, reason = '') => {
  await request(`${API_URL}/users/${userId}`, {
    method: 'DELETE',
    body: JSON.stringify({ reason })
  });
};

export const getReviewsForModeration = async (status = 'pending') => {
  const data = await request(`${API_URL}/reviews?status=${encodeURIComponent(status)}`);
  return data.reviews || [];
};

export const updateReviewModeration = async (reviewId, payload) => {
  const data = await request(`${API_URL}/reviews/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
  return data.review;
};

export const deleteModeratedReview = async (reviewId, reason = '') => {
  await request(`${API_URL}/reviews/${reviewId}`, {
    method: 'DELETE',
    body: JSON.stringify({ reason })
  });
};

export const getAdminRecipes = async () => {
  const data = await request(`${API_URL}/recipes`);
  return data.recipes || [];
};

export const createAdminRecipe = async (payload) => {
  const data = await request(`${API_URL}/recipes`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return data.recipe;
};

export const updateAdminRecipe = async (recipeId, payload) => {
  const data = await request(`${API_URL}/recipes/${recipeId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
  return data.recipe;
};

export const deleteAdminRecipe = async (recipeId, reason = '') => {
  await request(`${API_URL}/recipes/${recipeId}`, {
    method: 'DELETE',
    body: JSON.stringify({ reason })
  });
};

export const getModerationLogs = async (limit = 100) => {
  const data = await request(`${API_URL}/logs?limit=${limit}`);
  return data.logs || [];
};

export const updateModerationLogReason = async (logId, reason = '') => {
  const data = await request(`${API_URL}/logs/${logId}/reason`, {
    method: 'PATCH',
    body: JSON.stringify({ reason })
  });
  return data.log;
};

export const reverseModerationAction = async (logId, reason = '') => {
  const data = await request(`${API_URL}/logs/${logId}/reverse`, {
    method: 'POST',
    body: JSON.stringify({ reason })
  });
  return data.user;
};

export const getReportedReviews = async (status = 'pending') => {
  const data = await request(`${API_URL}/reports?status=${encodeURIComponent(status)}`);
  return data.reports || [];
};

export const decideReportedReview = async (reportId, status, decisionNote = '') => {
  const data = await request(`${API_URL}/reports/${reportId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status, decisionNote })
  });

  return data.report;
};

export default {
  getAdminUsers,
  updateUserRole,
  updateUserBanStatus,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  getReviewsForModeration,
  updateReviewModeration,
  deleteModeratedReview,
  getAdminRecipes,
  createAdminRecipe,
  updateAdminRecipe,
  deleteAdminRecipe,
  getModerationLogs,
  updateModerationLogReason,
  reverseModerationAction,
  getReportedReviews,
  decideReportedReview
};
