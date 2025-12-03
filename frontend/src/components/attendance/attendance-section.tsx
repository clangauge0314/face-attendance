import { motion } from 'framer-motion'
import { Calendar, UserCheck } from 'lucide-react'
import { AttendanceChart } from '../attendance/attendance-chart'
import { AttendanceHistory } from '../attendance/attendance-history'
import { useThemeStore } from '../../stores/theme-store'

interface AttendanceSectionProps {
  onCheckInClick: () => void
  refreshHistoryKey: number
}

export const AttendanceSection = ({ onCheckInClick, refreshHistoryKey }: AttendanceSectionProps) => {
  const { isDark } = useThemeStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className={`mb-6 rounded-3xl border p-8 shadow-xl backdrop-blur ${
        isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white/50'
      }`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6 text-center"
      >
        <h2 className={`mb-2 text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          출입 기록
        </h2>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
          얼굴 인증을 통해 출입을 기록하세요
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCheckInClick}
        className={`mb-6 w-full rounded-xl py-4 font-semibold transition-all ${
          isDark
            ? 'bg-linear-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400'
            : 'bg-linear-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600'
        } shadow-lg`}
      >
        <div className="flex items-center justify-center gap-2">
          <UserCheck size={24} />
          <span>출입 기록하기</span>
        </div>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <AttendanceChart />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="mb-4 flex items-center gap-2">
          <Calendar size={18} className={isDark ? 'text-slate-400' : 'text-zinc-500'} />
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            최근 출입 기록
          </h3>
        </div>
        <AttendanceHistory key={refreshHistoryKey} />
      </motion.div>
    </motion.div>
  )
}
