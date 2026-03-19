import { create } from 'zustand';

interface UIStore {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  colorScheme: 'light' | 'dark';
  toggleColorScheme: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  colorScheme: (localStorage.getItem('color-scheme') as 'light' | 'dark') || 'light',
  toggleColorScheme: () =>
    set((s) => {
      const next = s.colorScheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('color-scheme', next);
      return { colorScheme: next };
    }),
}));
