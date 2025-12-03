import { motion } from 'framer-motion'
import { CheckCircle, School, UserCheck } from 'lucide-react'
import { useThemeStore } from '../../stores/theme-store'

interface UserProfileProps {
  user: any
  logout: () => void
}

export const UserProfile = ({ user, logout }: UserProfileProps) => {
  const { isDark } = useThemeStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className={`mb-6 rounded-3xl border p-8 shadow-xl backdrop-blur ${
        isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white/50'
      }`}
    >
      <div className="mb-6 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
              isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'
            }`}
          >
            <School size={32} />
          </motion.div>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {user?.organizationType || '기관'} 출입 시스템
            </h1>
            <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
              환영합니다, {user?.name}님
            </p>
          </div>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            isDark
              ? 'bg-slate-700 text-white hover:bg-slate-600'
              : 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300'
          }`}
        >
          로그아웃
        </motion.button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`rounded-xl border p-4 transition-all ${
            isDark ? 'border-slate-800 bg-slate-800/50' : 'border-zinc-200 bg-zinc-50'
          }`}
        >
          <div className="mb-2 flex items-center gap-2">
            <UserCheck size={18} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
            <span className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-zinc-700'}`}>
              사용자 정보
            </span>
          </div>
          <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
            <div>이름: {user?.name}</div>
            <div>소속: {user?.organizationType}</div>
            <div>ID: {user?.userId}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`rounded-xl border p-4 transition-all ${
            isDark ? 'border-slate-800 bg-slate-800/50' : 'border-zinc-200 bg-zinc-50'
          }`}
        >
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle size={18} className={isDark ? 'text-green-400' : 'text-green-600'} />
            <span className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-zinc-700'}`}>
              인증 상태
            </span>
          </div>
          <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
            <div className="flex items-center gap-1">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`h-2 w-2 rounded-full ${isDark ? 'bg-green-400' : 'bg-green-600'}`}
              />
              얼굴 등록 완료
            </div>
            <div className="mt-1">시스템 사용 가능</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
