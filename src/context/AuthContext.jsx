'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = () => {
      console.log('AuthContext: Loading user from storage...');
      try {
        // Check localStorage first (remember me), then sessionStorage
        const localUser = localStorage.getItem('user');
        const sessionUser = sessionStorage.getItem('user');
        const storedUser = localUser || sessionUser;

        console.log('AuthContext: localStorage user:', localUser ? 'found' : 'not found');
        console.log('AuthContext: sessionStorage user:', sessionUser ? 'found' : 'not found');

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('AuthContext: Loaded user:', parsedUser.email);
          setUser(parsedUser);
        } else {
          console.log('AuthContext: No user found in storage');
        }
      } catch (error) {
        console.error('AuthContext: Error loading user:', error);
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = (userData, rememberMe = false) => {
    console.log('AuthContext: Login called, rememberMe:', rememberMe);
    console.log('AuthContext: User data:', userData.email);
    setUser(userData);

    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('rememberMe', 'true');
      console.log('AuthContext: Saved to localStorage');
    } else {
      sessionStorage.setItem('user', JSON.stringify(userData));
      console.log('AuthContext: Saved to sessionStorage');
    }
  };

  // Logout function
  const logout = () => {
    console.log('AuthContext: Logout called');
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('user');
    router.push('/user-login');
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
    if (localStorage.getItem('rememberMe')) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('user', JSON.stringify(userData));
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Get user role
  const userRole = user?.role || user?.accountType || null;

  console.log('AuthContext: Render - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    userRole,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export default AuthContext;
