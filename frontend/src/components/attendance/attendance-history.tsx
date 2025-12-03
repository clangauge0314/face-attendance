import { motion } from 'framer-motion'
import { Calendar, Clock, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getAttendanceHistory, type AttendanceResponse } from '../../api/attendance'
import { useThemeStore } from '../../stores/theme-store'

export const AttendanceHistory = () => {
  const { isDark } = useThemeStore()
  const [history, setHistory] = useState<AttendanceResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setIsLoading(true)
      const response = await getAttendanceHistory(20, 0)
      setHistory(response.items)
    } catch (error) {
      console.error('Failed to load attendance history', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return {
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}`,
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className={`animate-spin ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          <Clock size={24} />
        </div>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className={`rounded-xl border p-8 text-center ${
        isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white/50'
      }`}>
        <Calendar className={`mx-auto mb-4 ${isDark ? 'text-slate-400' : 'text-zinc-400'}`} size={48} />
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
          출입 기록이 없습니다.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {history.map((item, index) => {
        const { date, time } = formatDateTime(item.checkInTime)
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`rounded-xl border p-4 transition-all ${
              isDark
                ? 'border-slate-800 bg-slate-900/50 hover:bg-slate-900/70'
                : 'border-zinc-200 bg-white/50 hover:bg-white/70'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <User size={16} className={isDark ? 'text-slate-400' : 'text-zinc-500'} />
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {item.userName}
                  </span>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
                    ({item.organizationType})
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className={isDark ? 'text-slate-400' : 'text-zinc-500'} />
                    <span className={isDark ? 'text-slate-300' : 'text-zinc-700'}>{date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className={isDark ? 'text-slate-400' : 'text-zinc-500'} />
                    <span className={isDark ? 'text-slate-300' : 'text-zinc-700'}>{time}</span>
                  </div>
                </div>
              </div>
              <div className={`rounded-lg px-3 py-1 text-xs font-medium ${
                item.status === 'checked_in'
                  ? isDark
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-green-100 text-green-700'
                  : isDark
                  ? 'bg-slate-700 text-slate-300'
                  : 'bg-zinc-100 text-zinc-700'
              }`}>
                출입
              </div>
            </div>
            {item.similarity && (
              <div className={`mt-2 text-xs ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
                유사도: {(item.similarity * 100).toFixed(1)}%
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

