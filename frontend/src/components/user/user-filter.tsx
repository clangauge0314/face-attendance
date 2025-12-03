import { Search } from 'lucide-react'
import { useThemeStore } from '../../stores/theme-store'

interface UserFilterProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export const UserFilter = ({ searchQuery, setSearchQuery }: UserFilterProps) => {
  const { isDark } = useThemeStore()

  return (
    <div className={`mb-6 flex items-center rounded-2xl border px-4 py-3 ${
      isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'
    }`}>
      <Search className={isDark ? 'text-slate-400' : 'text-zinc-400'} size={20} />
      <input
        type="text"
        placeholder="이름, 아이디, 소속으로 검색..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`ml-3 w-full bg-transparent outline-none ${
          isDark ? 'text-white placeholder-slate-500' : 'text-zinc-900 placeholder-zinc-400'
        }`}
      />
    </div>
  )
}

