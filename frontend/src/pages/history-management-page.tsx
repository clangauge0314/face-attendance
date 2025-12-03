import { motion } from 'framer-motion'
import { Search, FileText, Clock, CheckCircle, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useThemeStore } from '../stores/theme-store'
import { getAdminAttendanceHistory, type AdminAttendanceRecord } from '../api/admin'

export const HistoryManagementPage = () => {
  const { isDark } = useThemeStore()
  const navigate = useNavigate()
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
  }, [page, startDate, endDate]) // Re-load when filters/page change

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(0) // Reset to first page
    loadHistory()
  }

  const handleResetFilters = () => {
    setStartDate('')
    setEndDate('')
    setSearchQuery('')
    setPage(0)
    // loadHistory will be triggered by useEffect because state changes
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className={`border-b px-8 py-6 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white/50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              출입 기록 관리
            </h1>
            <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
              전체 사용자의 출입 이력을 조회하고 관리합니다
            </p>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className={`rounded-xl px-4 py-2 font-semibold transition-colors ${
              isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300'
            }`}
          >
            대시보드로
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">
          {/* Filter Section */}
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
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
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
                  onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
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
                  onChange={(e) => { setEndDate(e.target.value); setPage(0); }}
                  className={`w-full rounded-xl border px-4 py-2.5 ${
                    isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-zinc-300 bg-zinc-50 text-zinc-900'
                  }`}
                />
              </div>

              <button
                onClick={handleSearch}
                className={`rounded-xl px-6 py-2.5 font-semibold transition-colors ${
                  isDark ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                조회
              </button>
              
              <button
                onClick={handleResetFilters}
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

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className={`animate-spin ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                <Clock size={32} />
              </div>
            </div>
          ) : records.length === 0 ? (
            <div className={`flex flex-col items-center justify-center py-20 ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
              <FileText size={48} className="mb-4 opacity-50" />
              <p>기록이 없습니다</p>
            </div>
          ) : (
            <>
              <div className={`overflow-hidden rounded-3xl border ${
                isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'
              }`}>
                <table className="w-full text-left">
                  <thead className={`border-b ${isDark ? 'border-slate-800 bg-slate-800/50' : 'border-zinc-200 bg-zinc-50'}`}>
                    <tr>
                      <th className={`p-4 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>사용자</th>
                      <th className={`p-4 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>소속</th>
                      <th className={`p-4 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>출입 시간</th>
                      <th className={`p-4 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>인증 결과</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-zinc-200'}`}>
                    {records.map((record) => (
                      <motion.tr
                        key={record.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`transition-colors ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-zinc-50'}`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              isDark ? 'bg-slate-800 text-slate-400' : 'bg-zinc-100 text-zinc-500'
                            }`}>
                              <CheckCircle size={16} className="text-green-500" />
                            </div>
                            <div>
                              <div className={`font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                                {record.userName}
                              </div>
                              <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-zinc-500'}`}>
                                @{record.userUserId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {record.organizationName ? (
                            <span className={`rounded-md px-2 py-1 text-xs font-medium ${
                              isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                            }`}>
                              {record.organizationName}
                            </span>
                          ) : (
                            <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-zinc-400'}`}>-</span>
                          )}
                        </td>
                        <td className={`p-4 text-sm ${isDark ? 'text-slate-300' : 'text-zinc-700'}`}>
                          {new Date(record.checkInTime).toLocaleString('ko-KR', {
                            year: 'numeric', 
                            month: '2-digit', 
                            day: '2-digit', 
                            hour: '2-digit', 
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'
                            }`}>
                              성공
                            </div>
                            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-zinc-400'}`}>
                              ({record.similarity ? (parseFloat(record.similarity) * 100).toFixed(1) : '0.0'}%)
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

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