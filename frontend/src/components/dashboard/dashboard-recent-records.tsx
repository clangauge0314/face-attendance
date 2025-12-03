import { motion } from 'framer-motion'
import { Calendar, CheckCircle } from 'lucide-react'
import { useThemeStore } from '../../stores/theme-store'

interface DashboardRecentRecordsProps {
  records: any[]
  delay?: number
}

export const DashboardRecentRecords = ({ records, delay = 0 }: DashboardRecentRecordsProps) => {
  const { isDark } = useThemeStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-3xl border p-6 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'}`}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          오늘의 출입 기록
        </h2>
        <Calendar className={isDark ? 'text-slate-400' : 'text-zinc-500'} size={20} />
      </div>

      <div className="space-y-2">
        {records.map((record: any) => (
          <div
            key={record.id}
            className={`flex items-center justify-between rounded-xl border p-4 ${
              isDark ? 'border-slate-800 bg-slate-800/30' : 'border-zinc-200 bg-zinc-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-500" size={20} />
              <div>
                <div className={`font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {record.userName}
                </div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
                  {new Date(record.checkInTime).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-500">
              출입 완료
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

