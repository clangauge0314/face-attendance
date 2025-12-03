import { motion } from 'framer-motion'
import { CheckCircle, Clock, XCircle } from 'lucide-react'
import { useThemeStore } from '../../stores/theme-store'
import type { AdminLoginLog } from '../../api/admin'

interface LoginLogsProps {
  logs: AdminLoginLog[]
  isLoading: boolean
}

export const LoginLogs = ({ logs, isLoading }: LoginLogsProps) => {
  const { isDark } = useThemeStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className={`mt-6 rounded-3xl border p-8 shadow-xl backdrop-blur ${
        isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white/50'
      }`}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          로그인 기록
        </h2>
        <Clock className={isDark ? 'text-slate-400' : 'text-zinc-500'} size={20} />
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className={`animate-spin ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            <Clock size={32} />
          </div>
        </div>
      ) : logs.length === 0 ? (
        <div className={`py-12 text-center ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
          로그인 기록이 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`rounded-xl border p-4 ${
                isDark
                  ? 'border-slate-800 bg-slate-800/30'
                  : 'border-zinc-200 bg-zinc-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {log.status === 'success' ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <XCircle className="text-red-500" size={20} />
                  )}
                  <div>
                    <div className={`font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                      {new Date(log.loginTime).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </div>
                    <div className={`mt-1 flex items-center gap-4 text-xs ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
                      <span>IP: {log.ipAddress || 'N/A'}</span>
                      {log.faceVerified === 'true' && (
                        <span className="flex items-center gap-1">
                          얼굴 인증: {log.similarity ? `${(parseFloat(log.similarity) * 100).toFixed(1)}%` : 'N/A'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`text-xs font-medium ${
                  log.status === 'success'
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}>
                  {log.status === 'success' ? '성공' : '실패'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
