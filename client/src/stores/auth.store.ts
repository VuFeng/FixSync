import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginRequest } from '../types';
import { authService } from '../services/auth.service';
import { STORAGE_KEYS } from '../constants';
import { isTokenExpired } from '../utils/jwt';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  checkAuth: () => boolean;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(credentials);
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        get().clearAuth();
      },

      setUser: (user: User) => {
        set({ user });
      },

      setToken: (token: string) => {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        set({ token, isAuthenticated: true });
      },

      checkAuth: () => {
        const { token } = get();
        if (!token) {
          get().clearAuth();
          return false;
        }

        // Check if token is expired
        if (isTokenExpired(token)) {
          get().clearAuth();
          return false;
        }

        // Verify user exists
        const { user } = get();
        if (!user) {
          get().clearAuth();
          return false;
        }

        return true;
      },

      clearAuth: () => {
        // Clear localStorage
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        // Clear zustand persist storage
        const storage = localStorage.getItem('auth-storage');
        if (storage) {
          localStorage.removeItem('auth-storage');
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

