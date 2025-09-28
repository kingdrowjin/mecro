import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Use the existing User type from types/index.ts
interface UserStoreUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

interface UserState {
  user: UserStoreUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;

  // Actions
  setUser: (user: UserStoreUser) => void;
  setToken: (token: string) => void;
  login: (user: UserStoreUser, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<UserStoreUser>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,

      setUser: (user: UserStoreUser) =>
        set({
          user,
          isAuthenticated: true,
        }),

      setToken: (token: string) =>
        set({ token }),

      login: (user: UserStoreUser, token: string) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (isLoading: boolean) =>
        set({ isLoading }),

      updateUser: (updates: Partial<UserStoreUser>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);