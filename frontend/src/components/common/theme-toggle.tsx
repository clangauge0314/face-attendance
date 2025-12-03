import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../../stores/theme-store'

const ThemeToggle = () => {
  const { isDark, setIsDark } = useThemeStore()

  return (
    <button
      aria-label='테마 전환'
      className={`fixed bottom-6 right-6 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-lg transition ${
        isDark
          ? 'bg-white/10 text-slate-100 backdrop-blur hover:bg-white/20'
          : 'bg-white text-zinc-900 hover:bg-zinc-100'
      }`}
      onClick={() => setIsDark()}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

export default ThemeToggle

