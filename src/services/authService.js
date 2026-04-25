// Authentication service for user management with backend API
const API_URL = 'http://localhost:3001/api/auth';
const AUTH_TOKEN_KEY = 'authToken';
const USER_ROLE_KEY = 'userRole';

/**
 * Get stored auth token
 */
const getToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Store auth token
 */
const setToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

/**
 * Store user role
 */
const setUserRole = (role) => {
  localStorage.setItem(USER_ROLE_KEY, role || 'user');
};

/**
 * Get stored user role
 */
export const getUserRole = () => {
  return localStorage.getItem(USER_ROLE_KEY) || 'user';
};

/**
 * Remove auth token
 */
const removeToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
};

/**
 * Get current user from token
 */
export const getCurrentUser = async () => {
  const userData = await getUserData();
  return userData.success ? userData.data : null;
};

/**
 * Register a new user with email, password, and username
 */
export const registerUser = async (email, password, username) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, username })
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Registration failed' };
    }

    // Store token
    setToken(data.token);
    setUserRole(data.user?.role);

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

/**
 * Login user with email and password
 */
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Login failed' };
    }

    // Store token
    setToken(data.token);
    setUserRole(data.user?.role);

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

/**
 * Logout current user
 */
export const logoutUser = async () => {
  try {
    removeToken();
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get current user data from backend
 */
export const getUserData = async () => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: 'No authentication token found' };
    }

    const response = await fetch(`${API_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        removeToken();
      }
      return { success: false, error: data.error || 'Failed to get user data' };
    }

    setUserRole(data.user?.role);

    return { success: true, data: data.user };
  } catch (error) {
    console.error('Get user data error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

/**
 * Update user's username
 */
export const updateUsername = async (newUsername) => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: 'No user logged in' };
    }

    const response = await fetch(`${API_URL}/update-username`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ username: newUsername })
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to update username' };
    }

    return { success: true };
  } catch (error) {
    console.error('Update username error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Update user's password
 */
export const updateUserPassword = async (currentPassword, newPassword) => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: 'No user logged in' };
    }

    const response = await fetch(`${API_URL}/update-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to update password' };
    }

    return { success: true };
  } catch (error) {
    console.error('Update password error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Check if current user is admin
 */
export const isAdmin = () => {
  return getUserRole() === 'admin';
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getUserData,
  updateUsername,
  updateUserPassword,
  getCurrentUser,
  isAuthenticated,
  isAdmin,
  getUserRole,
  getToken,
  setToken,
  setUserRole,
  removeToken
}
