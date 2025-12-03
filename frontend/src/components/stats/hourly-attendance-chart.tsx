import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useThemeStore } from '../../stores/theme-store'
import { ChartTooltip } from './chart-tooltip'

interface HourlyAttendanceChartProps {
  data: any[]
  delay?: number
}

export const HourlyAttendanceChart = ({ data, delay = 0 }: HourlyAttendanceChartProps) => {
  const { isDark } = useThemeStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-3xl border p-8 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'}`}
    >
      <h3 className={`mb-6 text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
        시간대별 출입 현황
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
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
              interval={3}
            />
            <YAxis 
              stroke={isDark ? '#94a3b8' : '#64748b'} 
              tick={{ fill: isDark ? '#94a3b8' : '#64748b' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<ChartTooltip />} />
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
  )
}

