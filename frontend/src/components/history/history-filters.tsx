import { Search, Filter } from 'lucide-react'
import { useThemeStore } from '../../stores/theme-store'

interface HistoryFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  startDate: string
  setStartDate: (date: string) => void
  endDate: string
  setEndDate: (date: string) => void
  onSearch: (e?: React.FormEvent) => void
  onReset: () => void
}

export const HistoryFilters = ({
  searchQuery,
  setSearchQuery,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onSearch,
  onReset
}: HistoryFiltersProps) => {
  const { isDark } = useThemeStore()

  return (
    <div className={`mb-6 rounded-3xl border p-6 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label className={`mb-2 block text-sm font-medium ${isDark ? 'text-slate-400' : 'text-zinc-600'}`}>
            검색
          </label>
          <div className={`flex items-center rounded-xl border px-4 py-2.5 ${
            isDark ? 'border-slate-700 bg-slate-800' : 'border-zinc-300 bg-zinc-50'
          }`}>
            <Search className={isDark ? 'text-slate-400' : 'text-zinc-400'} size={20} />
            <input
              type="text"
              placeholder="이름, 아이디, 조직명..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch(e)}
              className={`ml-3 w-full bg-transparent outline-none ${
                isDark ? 'text-white placeholder-slate-500' : 'text-zinc-900 placeholder-zinc-400'
              }`}
            />
          </div>
        </div>
        
        <div>
          <label className={`mb-2 block text-sm font-medium ${isDark ? 'text-slate-400' : 'text-zinc-600'}`}>
            시작일
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`w-full rounded-xl border px-4 py-2.5 ${
              isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-zinc-300 bg-zinc-50 text-zinc-900'
            }`}
          />
        </div>

        <div>
          <label className={`mb-2 block text-sm font-medium ${isDark ? 'text-slate-400' : 'text-zinc-600'}`}>
            종료일
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={`w-full rounded-xl border px-4 py-2.5 ${
              isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-zinc-300 bg-zinc-50 text-zinc-900'
            }`}
          />
        </div>

        <button
          onClick={onSearch}
          className={`rounded-xl px-6 py-2.5 font-semibold transition-colors ${
            isDark ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          조회
        </button>
        
        <button
          onClick={onReset}
          className={`rounded-xl border px-4 py-2.5 font-semibold transition-colors ${
            isDark 
              ? 'border-slate-700 text-slate-300 hover:bg-slate-800' 
              : 'border-zinc-300 text-zinc-600 hover:bg-zinc-100'
          }`}
          title="필터 초기화"
        >
          <Filter size={20} />
        </button>
      </div>
    </div>
  )
}

