import { create } from 'zustand';
import type { User, AuthTokens, RoleName, Permission } from '../types';
import { setTokens, clearTokens, getAccessToken } from '../services/api-client';
import { authApi } from '../services/api';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  init: () => Promise<void>;
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;

  hasRole: (role: RoleName | RoleName[]) => boolean;
  hasPermission: (module: string, action: Permission['actions'][number]) => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  init: async () => {
    const token = getAccessToken();
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }
    try {
      const user = await authApi.me();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: (user, tokens) => {
    setTokens(tokens.accessToken, tokens.refreshToken);
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    clearTokens();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),

  hasRole: (role) => {
    const user = get().user;
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role.name);
  },

  hasPermission: (module, action) => {
    const user = get().user;
    if (!user) return false;
    if (user.role.name === 'admin') return true;
    return user.role.permissions.some(
      (p) => p.module === module && p.actions.includes(action),
    );
  },
}));
