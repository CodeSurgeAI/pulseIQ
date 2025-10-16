import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from '@/types';
import { getUserByEmail, simulateApiDelay } from '@/utils/mock-data';
import { configService } from '@/utils/config';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call delay
          await simulateApiDelay(1500);
          
          // Mock authentication - in real app, this would be an API call
          const user = getUserByEmail(email);
          
          if (!user) {
            set({ isLoading: false });
            return { success: false, error: 'User not found' };
          }

          // For demo purposes, accept any password
          // In real app, password would be validated on the server
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'Login failed. Please try again.' };
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      initializeAuth: () => {
        // If login is disabled in config, automatically authenticate with default user
        if (!configService.isLoginEnabled) {
          const defaultUser = configService.defaultUser;
          // Find the user in mock data or use the config default
          const user = getUserByEmail(defaultUser.email) || {
            ...defaultUser,
            departments: [],
            permissions: [],
            lastLoginAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          set({
            user: user as User,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'pulseiq-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);