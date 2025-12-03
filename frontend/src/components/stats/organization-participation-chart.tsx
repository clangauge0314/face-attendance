import { motion } from 'framer-motion'
import { PieChart as PieIcon } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useThemeStore } from '../../stores/theme-store'
import { ChartTooltip } from './chart-tooltip'

interface OrganizationParticipationChartProps {
  data: any[]
  delay?: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

export const OrganizationParticipationChart = ({ data, delay = 0 }: OrganizationParticipationChartProps) => {
  const { isDark } = useThemeStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-3xl border p-8 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <PieIcon className="text-orange-500" size={24} />
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          조직별 출입 비중
        </h3>
      </div>
      <div className="h-[300px] w-full">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="label"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
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
  )
}

