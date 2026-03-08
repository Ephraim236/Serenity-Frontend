import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { storage } from '../utils/storage';
import { authApi, API_URL } from '../api/client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  googleAuthAvailable: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [googleAuthAvailable, setGoogleAuthAvailable] = useState(false);

  useEffect(() => {
    initializeAuth();
    checkGoogleAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const userJson = await storage.getUser();
      const token = await storage.getToken();

      if (userJson && token) {
        const storedUser = JSON.parse(userJson) as User;
        setUser(storedUser);
        verifyToken(token);
      }
    } catch {
      await storage.clearAll();
    } finally {
      setIsLoading(false);
    }
  };

  const checkGoogleAuth = async () => {
    try {
      const data = await authApi.getGoogleAuthStatus();
      setGoogleAuthAvailable(data.googleAuthAvailable);
    } catch {
      setGoogleAuthAvailable(false);
    }
  };

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        await storage.clearAll();
        setUser(null);
      } else {
        const userData = await response.json();
        const updatedUser: User = {
          id: userData.id || userData._id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          avatar: userData.avatar,
        };
        setUser(updatedUser);
        await storage.setUser(updatedUser);
      }
    } catch {
      // Keep existing user if network fails
    }
  };

  const login = async (newUser: User, token: string) => {
    setUser(newUser);
    await storage.setToken(token);
    await storage.setUser(newUser);
  };

  const logout = async () => {
    setUser(null);
    await storage.clearAll();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        googleAuthAvailable,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
