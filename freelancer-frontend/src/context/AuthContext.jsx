import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://gun-4m4j.onrender.com/api';

console.log('AuthContext initialized with API_URL:', API_URL);

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          console.log('Loading user with token...');
          const response = await axios.get(`${API_URL}/auth/me`);
          console.log('User loaded:', response.data.user);
          setUser(response.data.user);
          setError(null);
        } catch (err) {
          console.error('Failed to load user:', err.message, err.response?.status);
          setError(err.message);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const register = async (userData) => {
    try {
      console.log('Registering user:', userData.username);
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      console.log('Registration successful');
      setToken(response.data.token);
      setUser(response.data.user);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Registration failed:', err.message, err.response?.data);
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const login = async (credentials) => {
    try {
      console.log('Logging in user:', credentials.emailOrUsername);
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      console.log('Login successful');
      setToken(response.data.token);
      setUser(response.data.user);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Login failed:', err.message, err.response?.data);
      const errorMsg = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem('token');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, profileData);
      setUser(response.data.user);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Update profile failed:', err.message);
      const errorMsg = err.response?.data?.message || err.message || 'Update failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const reloadUser = async () => {
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/auth/me`);
        setUser(response.data.user);
        setError(null);
      } catch (err) {
        console.error('Failed to reload user:', err.message);
      }
    }
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    updateProfile,
    reloadUser,
    isAuthenticated: !!user,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
