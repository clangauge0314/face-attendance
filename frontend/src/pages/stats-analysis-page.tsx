import { motion } from 'framer-motion'
import { BarChart3, Users, TrendingUp, Clock, PieChart as PieIcon, Award } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { toast } from 'sonner'
import { useThemeStore } from '../stores/theme-store'
import { getAdminDashboardStats, getAdminAttendanceStats, type AdminDashboardStats, type AdminAttendanceStats } from '../api/admin'

export const StatsAnalysisPage = () => {
  const { isDark } = useThemeStore()
  const navigate = useNavigate()
  const [dashboardStats, setDashboardStats] = useState<AdminDashboardStats | null>(null)
  const [chartStats, setChartStats] = useState<AdminAttendanceStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [dashData, chartData] = await Promise.all([
        getAdminDashboardStats(),
        getAdminAttendanceStats()
      ])
      setDashboardStats(dashData)
      setChartStats(chartData)
    } catch (error) {
      toast.error('통계 데이터 로드 실패')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className={`animate-spin ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          <BarChart3 size={48} />
        </div>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`rounded-lg border p-3 shadow-lg ${
          isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-zinc-200 bg-white text-zinc-900'
        }`}>
          <p className="mb-1 text-sm font-bold">{label}</p>
          <p className="text-sm">
            값: <span className="font-bold text-blue-500">{payload[0].value}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className={`border-b px-8 py-6 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white/50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              통계 및 분석
            </h1>
            <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
              시스템 전체 현황을 분석합니다
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
        <div className="mx-auto max-w-6xl space-y-8">
          
          {/* 주요 지표 카드 */}
          <div className="grid gap-6 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-3xl border p-8 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>총 사용자</p>
                  <p className={`mt-2 text-4xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {dashboardStats?.totalUsers.toLocaleString()}
                  </p>
                </div>
                <Users className="text-blue-500" size={48} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`rounded-3xl border p-8 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>오늘 출입</p>
                  <p className={`mt-2 text-4xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    {dashboardStats?.todayEntries.toLocaleString()}
                  </p>
                </div>
                <Clock className="text-green-500" size={48} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`rounded-3xl border p-8 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>이번 달 출입</p>
                  <p className={`mt-2 text-4xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                    {dashboardStats?.thisMonthEntries.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="text-purple-500" size={48} />
              </div>
            </motion.div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* 최근 7일 출입 추이 차트 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`rounded-3xl border p-8 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'}`}
            >
              <h3 className={`mb-6 text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                최근 7일 출입 추이
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartStats?.daily}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} vertical={false} />
                    <XAxis 
                      dataKey="label" 
                      stroke={isDark ? '#94a3b8' : '#64748b'} 
                      tick={{ fill: isDark ? '#94a3b8' : '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke={isDark ? '#94a3b8' : '#64748b'} 
                      tick={{ fill: isDark ? '#94a3b8' : '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? '#334155' : '#f1f5f9', opacity: 0.4 }} />
                    <Bar 
                      dataKey="count" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]} 
                      barSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* 시간대별 출입 현황 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`rounded-3xl border p-8 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'}`}
            >
              <h3 className={`mb-6 text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                시간대별 출입 현황
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartStats?.hourly}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} vertical={false} />
                    <XAxis 
                      dataKey="label" 
                      stroke={isDark ? '#94a3b8' : '#64748b'} 
                      tick={{ fill: isDark ? '#94a3b8' : '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      interval={3} // 3시간 간격으로 표시
                    />
                    <YAxis 
                      stroke={isDark ? '#94a3b8' : '#64748b'} 
                      tick={{ fill: isDark ? '#94a3b8' : '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#10b981" 
                      fillOpacity={1} 
                      fill="url(#colorCount)" 
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* 조직별 출입 비중 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`rounded-3xl border p-8 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'}`}
            >
              <div className="flex items-center gap-3 mb-6">
                <PieIcon className="text-orange-500" size={24} />
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  조직별 출입 비중
                </h3>
              </div>
              <div className="h-[300px] w-full">
                {chartStats?.organizations && chartStats.organizations.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartStats.organizations as any}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="label"
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      >
                        {chartStats.organizations.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    데이터가 없습니다
                  </div>
                )}
              </div>
            </motion.div>

            {/* 최다 출입 사용자 랭킹 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={`rounded-3xl border p-8 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'}`}
            >
              <div className="flex items-center gap-3 mb-6">
                <Award className="text-yellow-500" size={24} />
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  최다 출입 사용자 Top 5
                </h3>
              </div>
              <div className="h-[300px] w-full">
                {chartStats?.userRanking && chartStats.userRanking.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={chartStats.userRanking}
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="label" 
                        type="category" 
                        width={80}
                        stroke={isDark ? '#94a3b8' : '#64748b'} 
                        tick={{ fill: isDark ? '#94a3b8' : '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? '#334155' : '#f1f5f9', opacity: 0.4 }} />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={32}>
                        {chartStats.userRanking.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#FFBB28' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#8b5cf6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    데이터가 없습니다
                  </div>
                )}
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </div>
  )
}