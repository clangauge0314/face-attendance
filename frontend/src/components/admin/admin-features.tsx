import { motion } from 'framer-motion'
import { BarChart3, Calendar, Settings, Users, Building2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '../../stores/theme-store'

export const AdminFeatures = () => {
  const { isDark } = useThemeStore()
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`rounded-3xl border p-8 shadow-xl backdrop-blur ${
        isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white/50'
      }`}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          관리 기능
        </h2>
        <Settings className={isDark ? 'text-slate-400' : 'text-zinc-500'} size={20} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/admin/organizations')}
          className={`rounded-xl border p-6 text-left transition-all ${
            isDark
              ? 'border-slate-800 bg-slate-800/50 hover:bg-slate-800/70'
              : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100'
          }`}
        >
          <Building2 className={`mb-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} size={24} />
          <h3 className={`mb-1 font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            조직 관리
          </h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
            조직 생성 및 멤버 관리
          </p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/admin/users')}
          className={`rounded-xl border p-6 text-left transition-all ${
            isDark
              ? 'border-slate-800 bg-slate-800/50 hover:bg-slate-800/70'
              : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100'
          }`}
        >
          <Users className={`mb-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} size={24} />
          <h3 className={`mb-1 font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            사용자 관리
          </h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
            사용자 목록 및 관리
          </p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/admin/history')}
          className={`rounded-xl border p-6 text-left transition-all ${
            isDark
              ? 'border-slate-800 bg-slate-800/50 hover:bg-slate-800/70'
              : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100'
          }`}
        >
          <Calendar className={`mb-3 ${isDark ? 'text-green-400' : 'text-green-600'}`} size={24} />
          <h3 className={`mb-1 font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            출입 기록 관리
          </h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
            전체 출입 기록 조회
          </p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/admin/stats')}
          className={`rounded-xl border p-6 text-left transition-all ${
            isDark
              ? 'border-slate-800 bg-slate-800/50 hover:bg-slate-800/70'
              : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100'
          }`}
        >
          <BarChart3 className={`mb-3 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} size={24} />
          <h3 className={`mb-1 font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            통계 및 분석
          </h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
            출입 통계 분석
          </p>
        </motion.button>
      </div>
    </motion.div>
  )
}
