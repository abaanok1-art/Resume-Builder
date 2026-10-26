import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE = '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('rb_token') || null);
  const [loading, setLoading] = useState(true);

  // Helper safe fetch
  const safeFetch = async (endpoint, options = {}) => {
    let res;
    try {
      res = await fetch(`${API_BASE}${endpoint}`, options);
    } catch (networkErr) {
      // Try direct fallback to port 5000
      try {
        res = await fetch(`http://localhost:5000/api${endpoint}`, options);
      } catch (fallbackErr) {
        throw new Error('Backend server is offline. Please ensure the backend is running on port 5000.');
      }
    }

    let data;
    try {
      data = await res.json();
    } catch (parseErr) {
      throw new Error('Server returned an empty or invalid response. Please ensure the server is running on port 5000.');
    }

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  };

  // Check token and fetch user on load
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('rb_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await safeFetch('/auth/me', {
          headers: { 'Authorization': `Bearer ${storedToken}` }
        });

        if (data.success && data.user) {
          setUser(data.user);
          setToken(storedToken);
        } else {
          localStorage.removeItem('rb_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Sign Up function (takes name, email, password)
  const signup = async (name, email, password) => {
    const data = await safeFetch('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    localStorage.setItem('rb_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  // Login function (takes email, password)
  const login = async (email, password) => {
    const data = await safeFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    localStorage.setItem('rb_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('rb_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: !!user,
      signup,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
