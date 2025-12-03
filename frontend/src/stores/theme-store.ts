import { create } from 'zustand'

type ThemeState = {
  isDark: boolean
  setIsDark: (value?: boolean) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,
  setIsDark: (value) =>
    set((state) => ({
      isDark: typeof value === 'boolean' ? value : !state.isDark,
    })),
}))

