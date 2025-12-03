import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useThemeStore } from '../../stores/theme-store'
import { ChartTooltip } from './chart-tooltip'

interface DailyTrendChartProps {
  data: any[]
  delay?: number
}

export const DailyTrendChart = ({ data, delay = 0 }: DailyTrendChartProps) => {
  const { isDark } = useThemeStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-3xl border p-8 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'}`}
    >
      <h3 className={`mb-6 text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
        최근 7일 출입 추이
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
            <Tooltip content={<ChartTooltip />} cursor={{ fill: isDark ? '#334155' : '#f1f5f9', opacity: 0.4 }} />
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
  )
}

