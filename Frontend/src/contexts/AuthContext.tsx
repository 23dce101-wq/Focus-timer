import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import { syncSessionsFromServer } from '@/lib/timerStorage';
import { User, LoginCredentials, SignupCredentials, AuthState } from '@/types/auth.types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      if (authService.isAuthenticated()) {
        try {
          const user = await authService.getCurrentUser();
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          try {
            if (user && user.id) {
              localStorage.setItem('userId', user.id);
            }
            await syncSessionsFromServer();
          } catch (e) {
            console.error('Failed to persist userId:', e);
          }
        } catch (error) {
          console.error('Failed to load user:', error);
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          try {
            localStorage.removeItem('userId');
          } catch (e) {
            console.error('Failed to clear userId:', e);
          }
        }
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
        try {
          localStorage.removeItem('userId');
        } catch (e) {
          console.error('Failed to clear userId:', e);
        }
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const { user } = await authService.login(credentials);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      try {
        if (user && user.id) {
          localStorage.setItem('userId', user.id);
        }
        await syncSessionsFromServer();
      } catch (e) {
        console.error('Failed to persist userId:', e);
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      throw error;
    }
  }, []);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const { user } = await authService.signup(credentials);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      try {
        if (user && user.id) {
          localStorage.setItem('userId', user.id);
        }
        await syncSessionsFromServer();
      } catch (e) {
        console.error('Failed to persist userId:', e);
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Signup failed',
      }));
      throw error;
    }
  }, []);

  const loginWithGoogle = useCallback(async (token: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const { user } = await authService.loginWithGoogle(token);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      try {
        if (user && user.id) {
          localStorage.setItem('userId', user.id);
        }
        await syncSessionsFromServer();
      } catch (e) {
        console.error('Failed to persist userId:', e);
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Google login failed',
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      try {
        localStorage.removeItem('userId');
      } catch (e) {
        console.error('Failed to clear userId:', e);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const updateUser = useCallback(async (data: Partial<User>) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const updatedUser = await authService.updateProfile(data);
      setState((prev) => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Update failed',
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
