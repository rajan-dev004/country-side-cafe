import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      // STEP 3a: Call the real Django login endpoint
      // POST /api/accounts/login/ with { username, password }
      // Django (SimpleJWT) returns: { access: '...', refresh: '...' }
      const data = await apiRequest('/auth/login/', 'POST', { username, password });

      // STEP 3b: The 'access' token is what we use for future protected requests
      const accessToken = data.access;

      // STEP 3c: Fetch the user's profile using the token we just got
      // GET /api/accounts/profile/ with Authorization header
      const userProfile = await apiRequest('/auth/profile/', 'GET', null, accessToken);

      // STEP 3d: Save token and user to localStorage (persists across page refresh)
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refresh', data.refresh);         // save refresh token too
      localStorage.setItem('user', JSON.stringify(userProfile));

      // STEP 3e: Update React state so the UI re-renders as logged in
      setToken(accessToken);
      setUser(userProfile);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      // STEP 3f: Call the real Django register endpoint
      // POST /api/accounts/register/ with { username, email, password }
      // Our RegisterView returns: { user: {...}, access: '...', refresh: '...' }
      const data = await apiRequest('/auth/register/', 'POST', { username, email, password });

      // STEP 3g: Django already gave us user + tokens in one shot (we built it that way!)
      const accessToken = data.access;
      const userProfile = data.user;

      // STEP 3h: Save to localStorage and update state
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refresh', data.refresh);
      localStorage.setItem('user', JSON.stringify(userProfile));

      setToken(accessToken);
      setUser(userProfile);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (googleToken) => {
    setLoading(true);
    try {
      // Send the token from Google to our Django backend
      const data = await apiRequest('/auth/google/', 'POST', { token: googleToken });
      
      const accessToken = data.access;
      const userProfile = data.user;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('refresh', data.refresh);
      localStorage.setItem('user', JSON.stringify(userProfile));

      setToken(accessToken);
      setUser(userProfile);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, loginWithGoogle, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
