const API_URL = 'http://localhost:3001/api/admin';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...(options.headers || {})
    },
    ...options
  });

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

export const getModerationLogs = async (limit = 100) => {
  const data = await request(`${API_URL}/logs?limit=${limit}`);
  return data.logs || [];
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
  getReviewsForModeration,
  updateReviewModeration,
  deleteModeratedReview,
  getModerationLogs,
  getReportedReviews,
  decideReportedReview
};
