// Centralized API base URL for local and production deployments.
// - Local dev: Vue dev server proxies /api to localhost:3001
// - Vercel: API can run on the same domain at /api
const RAW_API_BASE_URL = process.env.VUE_APP_API_BASE_URL || '/api';
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/$/, '');

export const getApiBaseUrl = () => API_BASE_URL;

export const getApiUrl = (path = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export default {
  getApiBaseUrl,
  getApiUrl
};
