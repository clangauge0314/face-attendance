import { ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useThemeStore } from '../stores/theme-store'
import { getAdminAttendanceHistory, type AdminAttendanceRecord } from '../api/admin'
import { PageHeader } from '../components/common/page-header'
import { LoadingSpinner } from '../components/common/loading-spinner'
import { EmptyState } from '../components/common/empty-state'
import { HistoryFilters } from '../components/history/history-filters'
import { HistoryTable } from '../components/history/history-table'

export const HistoryManagementPage = () => {
  const { isDark } = useThemeStore()
  const [records, setRecords] = useState<AdminAttendanceRecord[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  // Filters
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  
  // Pagination
  const [page, setPage] = useState(0)
  const [limit] = useState(20)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [page]) // Re-load when page changes. Filters handled by search button

  const loadHistory = async () => {
    try {
      setIsLoading(true)
      const offset = page * limit
      const data = await getAdminAttendanceHistory(limit, offset, startDate, endDate, searchQuery)
      
      if (data.length < limit) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }
      
      setRecords(data)
    } catch (error) {
      toast.error('출입 기록 로드 실패')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    setPage(0) // Reset to first page
    loadHistory()
  }

  const handleResetFilters = () => {
    setStartDate('')
    setEndDate('')
    setSearchQuery('')
    setPage(0)
    // loadHistory called via useEffect when page is reset to 0, or if page was already 0, we need to call it manually
    // but since state updates are batched/async, safer to just call loadHistory in next tick or rely on dependency if we added filters to it.
    // The original code had filters in dependency, but here we have explicit search button.
    // Let's just reload after state update. Since setState is async, we might need useEffect on filters if we want instant update, 
    // but requirement is search button. 
    // Actually original code: useEffect(() => { loadHistory() }, [page, startDate, endDate])
    // But filter inputs were bound to state directly.
    // Let's trigger load manually after a short timeout or use a separate effect if we want to support reset -> auto reload.
    // For now, simple approach:
    setTimeout(() => loadHistory(), 0)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader 
        title="출입 기록 관리" 
        description="전체 사용자의 출입 이력을 조회하고 관리합니다"
        backButton={{ label: "대시보드로", to: "/admin" }}
      />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">
          <HistoryFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            onSearch={handleSearch}
            onReset={handleResetFilters}
          />

          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner fullScreen={false} size={32} />
            </div>
          ) : records.length === 0 ? (
            <EmptyState icon={FileText} message="기록이 없습니다" />
          ) : (
            <>
              <HistoryTable records={records} />

              {/* Pagination Controls */}
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                    page === 0
                      ? isDark ? 'border-slate-800 text-slate-600' : 'border-zinc-200 text-zinc-300'
                      : isDark ? 'border-slate-700 text-white hover:bg-slate-800' : 'border-zinc-300 text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  <ChevronLeft size={16} />
                  이전
                </button>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-zinc-600'}`}>
                  페이지 {page + 1}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={!hasMore}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                    !hasMore
                      ? isDark ? 'border-slate-800 text-slate-600' : 'border-zinc-200 text-zinc-300'
                      : isDark ? 'border-slate-700 text-white hover:bg-slate-800' : 'border-zinc-300 text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  다음
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
