
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  github_id?: string;
}

interface AuthContextType {
  user: User | null;
  sessionToken: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, fullName: string, username: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginWithGithub: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Funkcja do weryfikacji tokena
  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth-verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
      return null;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  };

  // Sprawdzenie tokena przy załadowaniu
  useEffect(() => {
    const token = localStorage.getItem('sessionToken');
    if (token) {
      verifyToken(token).then((userData) => {
        if (userData) {
          setUser(userData);
          setSessionToken(token);
        } else {
          localStorage.removeItem('sessionToken');
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setSessionToken(data.sessionToken);
        localStorage.setItem('sessionToken', data.sessionToken);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (email: string, password: string, fullName: string, username: string) => {
    try {
      const response = await fetch('/api/auth-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName, username }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.sessionToken) {
          setUser(data.user);
          setSessionToken(data.sessionToken);
          localStorage.setItem('sessionToken', data.sessionToken);
        }
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    setSessionToken(null);
    localStorage.removeItem('sessionToken');
  };

  const loginWithGithub = () => {
    const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/auth-github`;
    const scope = 'user:email';
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    
    window.location.href = githubAuthUrl;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionToken,
        login,
        register,
        logout,
        loginWithGithub,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
