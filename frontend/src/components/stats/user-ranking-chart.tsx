import { motion } from 'framer-motion'
import { Award } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { useThemeStore } from '../../stores/theme-store'
import { ChartTooltip } from './chart-tooltip'

interface UserRankingChartProps {
  data: any[]
  delay?: number
}

export const UserRankingChart = ({ data, delay = 0 }: UserRankingChartProps) => {
  const { isDark } = useThemeStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-3xl border p-8 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <Award className="text-yellow-500" size={24} />
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          최다 출입 사용자 Top 5
        </h3>
      </div>
      <div className="h-[300px] w-full">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
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
              <Tooltip content={<ChartTooltip />} cursor={{ fill: isDark ? '#334155' : '#f1f5f9', opacity: 0.4 }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={32}>
                {data.map((_entry, index) => (
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
  )
}

