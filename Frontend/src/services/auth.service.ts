import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  User,
  AuthTokens,
  LoginCredentials,
  SignupCredentials,
  AuthResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
} from '@/types/auth.types';
import { API_BASE_URL } from '@/config/api';

class AuthService {
  private api: AxiosInstance;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.handleTokenRefresh();
            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.api(originalRequest);
          } catch (refreshError) {
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async handleTokenRefresh(): Promise<string> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = (async () => {
      try {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        this.setTokens({ accessToken, refreshToken: newRefreshToken });
        return accessToken;
      } finally {
        this.refreshTokenPromise = null;
      }
    })();

    return this.refreshTokenPromise;
  }

  // Token management
  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private setTokens(tokens: AuthTokens): void {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Auth methods
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/signup', credentials);
      this.setTokens(response.data.tokens);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/login', credentials);
      this.setTokens(response.data.tokens);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async loginWithGoogle(token: string): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/google', { token });
      this.setTokens(response.data.tokens);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.api.get<{ user: User }>('/auth/me');
      return response.data.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await this.api.patch<User>('/auth/profile', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    try {
      await this.api.post('/auth/password-reset/request', data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async confirmPasswordReset(data: PasswordResetConfirm): Promise<void> {
    try {
      await this.api.post('/auth/password-reset/confirm', data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await this.api.post('/auth/change-password', { currentPassword, newPassword });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      return new Error(message);
    }
    return error instanceof Error ? error : new Error('An unexpected error occurred');
  }
}

export const authService = new AuthService();
