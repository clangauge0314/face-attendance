import { motion } from 'framer-motion'
import { BarChart3, Calendar, Users, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useThemeStore } from '../../stores/theme-store'
import { getAdminDashboardStats, type AdminDashboardStats } from '../../api/admin'

export const DashboardStats = () => {
  const { isDark } = useThemeStore()
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getAdminDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to load dashboard stats:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.02, y: -2 }}
        className={`rounded-2xl border p-6 transition-all ${
          isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white/50'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>전체 사용자</p>
            <p className={`mt-2 text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {isLoading ? '-' : stats?.totalUsers.toLocaleString() || 0}
            </p>
          </div>
          <Users className={isDark ? 'text-blue-400' : 'text-blue-600'} size={40} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.02, y: -2 }}
        className={`rounded-2xl border p-6 transition-all ${
          isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white/50'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>오늘 출입</p>
            <p className={`mt-2 text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {isLoading ? '-' : stats?.todayEntries.toLocaleString() || 0}
            </p>
          </div>
          <Calendar className={isDark ? 'text-green-400' : 'text-green-600'} size={40} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02, y: -2 }}
        className={`rounded-2xl border p-6 transition-all ${
          isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white/50'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>이번 달 출입</p>
            <p className={`mt-2 text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {isLoading ? '-' : stats?.thisMonthEntries.toLocaleString() || 0}
            </p>
          </div>
          <TrendingUp className={isDark ? 'text-purple-400' : 'text-purple-600'} size={40} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02, y: -2 }}
        className={`rounded-2xl border p-6 transition-all ${
          isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white/50'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>출입률</p>
            <p className={`mt-2 text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {isLoading || !stats || stats.totalUsers === 0
                ? '-'
                : `${((stats.todayEntries / stats.totalUsers) * 100).toFixed(1)}%`}
            </p>
          </div>
          <BarChart3 className={isDark ? 'text-orange-400' : 'text-orange-600'} size={40} />
        </div>
      </motion.div>
    </div>
  )
}
