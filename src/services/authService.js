import axios from 'axios';

// Login uses /auth (no /api)
const AUTH_URL = 'http://localhost:8080/auth';

// Store token in localStorage
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Login - uses /auth endpoint
export const login = async (username, password) => {
  try {
    console.log('Attempting login with:', { username, password });

    const response = await axios.post(`${AUTH_URL}/login`, {
      username,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Login response:', response.data);

    const { token, role, username: userName } = response.data;
    setAuthToken(token);

    localStorage.setItem('user', JSON.stringify({
      username: userName,
      role
    }));

    return { success: true, role };
  } catch (error) {
    console.error('Login error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    return {
      success: false,
      error: error.response?.data?.message || 'Login failed'
    };
  }
};

// Register - uses /auth endpoint
export const register = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_URL}/register`, userData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Registration failed'
    };
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Setup axios interceptor for token (for subsequent requests)
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);