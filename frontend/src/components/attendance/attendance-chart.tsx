import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Calendar, Clock, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getAttendanceStats, type AttendanceStatsResponse } from '../../api/attendance'
import { useThemeStore } from '../../stores/theme-store'

type PeriodType = 'minute' | 'hour' | 'day' | 'month' | 'year'

export const AttendanceChart = () => {
  const { isDark } = useThemeStore()
  const [period, setPeriod] = useState<PeriodType>('day')
  const [stats, setStats] = useState<AttendanceStatsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [period])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      const response = await getAttendanceStats(period)
      setStats(response)
    } catch (error) {
      console.error('Failed to load attendance stats', error)
    } finally {
      setIsLoading(false)
    }
  }

  const periodLabels: Record<PeriodType, string> = {
    minute: '분',
    hour: '시',
    day: '일',
    month: '월',
    year: '년',
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className={`animate-spin ${isDark ? 'text-white' : 'text-zinc-900'}`} size={32} />
      </div>
    )
  }

  if (!stats || stats.items.length === 0) {
    return (
      <div className={`rounded-xl border p-8 text-center ${
        isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white/50'
      }`}>
        <Calendar className={`mx-auto mb-4 ${isDark ? 'text-slate-400' : 'text-zinc-400'}`} size={48} />
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
          표시할 출입 기록이 없습니다.
        </p>
      </div>
    )
  }

  const formatTime = (value: number) => {
    const hours = Math.floor(value)
    const minutes = Math.round((value - hours) * 60)
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }

  const isTimeView = period === 'day'
  
  const chartData = stats.items.map((item) => ({
    name: item.label,
    value: isTimeView && item.firstCheckIn !== undefined ? item.firstCheckIn : item.count,
    displayValue: isTimeView && item.firstCheckIn !== undefined ? formatTime(item.firstCheckIn) : `${item.count}회`,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl border p-6 shadow-lg backdrop-blur ${
        isDark ? 'border-slate-800 bg-slate-900/80' : 'border-zinc-200 bg-white/80'
      }`}
    >
      <div className="mb-6 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            {isTimeView ? '일별 출근 시간' : '출입 기록 통계'}
          </h3>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
            {isTimeView 
              ? '일자별 최초 출입(출근) 시간' 
              : `${periodLabels[period]} 단위로 집계된 출입 횟수`
            }
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2"
        >
          {(['minute', 'hour', 'day', 'month', 'year'] as PeriodType[]).map((p, index) => (
            <motion.button
              key={p}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPeriod(p)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                period === p
                  ? isDark
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              {periodLabels[p]}
            </motion.button>
          ))}
        </motion.div>
      </div>

      <motion.div
        key={period}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="h-80 w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isDark ? '#3b82f6' : '#2563eb'}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={isDark ? '#3b82f6' : '#2563eb'}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#475569' : '#e4e4e7'}
              opacity={0.3}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: isDark ? '#cbd5e1' : '#52525b', fontSize: 12 }}
              stroke={isDark ? '#475569' : '#d4d4d8'}
            />
            <YAxis
              domain={isTimeView ? ['dataMin - 1', 'dataMax + 1'] : [0, 'auto']}
              tickFormatter={isTimeView ? (val) => formatTime(val) : undefined}
              tick={{ fill: isDark ? '#cbd5e1' : '#52525b', fontSize: 12 }}
              stroke={isDark ? '#475569' : '#d4d4d8'}
            />
            <Tooltip
              formatter={(_value: number, _name: string, props: any) => [
                props.payload.displayValue, 
                isTimeView ? '출근 시간' : '횟수'
              ]}
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                border: isDark ? '1px solid #334155' : '1px solid #e4e4e7',
                borderRadius: '12px',
                color: isDark ? '#f1f5f9' : '#18181b',
                boxShadow: isDark
                  ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                  : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: isDark ? '#cbd5e1' : '#52525b', fontWeight: 600 }}
              itemStyle={{ color: isDark ? '#f1f5f9' : '#18181b' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={isDark ? '#60a5fa' : '#3b82f6'}
              strokeWidth={3}
              dot={{ fill: isDark ? '#3b82f6' : '#2563eb', r: 5 }}
              activeDot={{ r: 8, fill: isDark ? '#60a5fa' : '#3b82f6' }}
              fill="url(#colorCount)"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`mt-4 flex items-center justify-center gap-2 text-xs ${
          isDark ? 'text-slate-400' : 'text-zinc-500'
        }`}
      >
        <Clock size={14} />
        <span>
          {isTimeView 
            ? '해당 기간의 최초 출입 시간 추이' 
            : `총 ${stats.items.reduce((sum, item) => sum + item.count, 0)}건의 출입 기록`
          }
        </span>
      </motion.div>
    </motion.div>
  )
}

