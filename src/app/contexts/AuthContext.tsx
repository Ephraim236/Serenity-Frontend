import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  role: "client" | "business";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  loginWithGoogle: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "serenity_auth_user";
const TOKEN_KEY = "serenity_auth_token";

// Dynamic API URL based on environment
const getApiUrl = () => {
  // Check if running locally
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  // Use production backend URL
  return 'https://serenity-gamma-two.vercel.app';
};

const API_URL = getApiUrl();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user and token on mount
    const storedUser = localStorage.getItem(STORAGE_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
        // Verify token is still valid
        verifyToken(token);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        // Token invalid, clear storage
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      }
    } catch (error) {
      console.error("Token verification failed:", error);
    }
  };

  const login = (newUser: User, token: string) => {
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    localStorage.setItem(TOKEN_KEY, token);
  };

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  // Don't handle browser back button - allow natural navigation
  // This was removed because it was interfering with the back button functionality

  const loginWithGoogle = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper function to get auth token
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// API helper functions
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }
    
    return response.json();
  },
  
  register: async (data: { 
    email: string; 
    password: string; 
    name: string; 
    role: string; 
    businessName?: string;
    businessEmail?: string;
    businessPhone?: string;
    location?: {
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    serviceHours?: {
      [key: string]: { open: string; close: string; isClosed: boolean };
    };
    operatingDays?: string[];
    businessImages?: string[];
  }) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Registration failed");
    }
    
    return response.json();
  },
  
  getGoogleAuthStatus: async () => {
    const response = await fetch(`${API_URL}/api/auth/google/status`);
    return response.json();
  },

  uploadImage: async (file: File): Promise<{ url: string }> => {
    const token = localStorage.getItem(TOKEN_KEY);
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/api/upload/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Upload failed");
    }

    return response.json();
  },
};
