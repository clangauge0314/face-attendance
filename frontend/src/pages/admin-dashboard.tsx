import { motion } from 'framer-motion'
import { LogOut, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { getAdminMe, getAdminLoginLogs, type AdminLoginLog } from '../api/admin'
import { getFaceEmbeddings } from '../api/face'
import { getToken, removeToken } from '../utils/local-storage'
import { useThemeStore } from '../stores/theme-store'
import { DashboardStats } from '../components/admin/dashboard-stats'
import { AdminFeatures } from '../components/admin/admin-features'
import { LoginLogs } from '../components/admin/login-logs'

export const AdminDashboard = () => {
  const { isDark } = useThemeStore()
  const navigate = useNavigate()
  const [admin, setAdmin] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loginLogs, setLoginLogs] = useState<AdminLoginLog[]>([])
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)

  useEffect(() => {
    const loadAdmin = async () => {
      const token = getToken()
      if (!token) {
        navigate('/admin/login')
        return
      }

      try {
        const adminData = await getAdminMe()
        setAdmin(adminData)

        const embeddings = await getFaceEmbeddings()
        const hasFaceData = embeddings.length > 0

        if (!hasFaceData) {
          toast.info('얼굴 데이터 등록 필요', {
            description: '관리자 기능을 사용하기 전에 얼굴 데이터를 등록해주세요.',
          })
          navigate('/admin/face-setup')
          return
        }

        setIsLoadingLogs(true)
        try {
          const logs = await getAdminLoginLogs(5, 0)
          setLoginLogs(logs)
        } catch (error) {
          console.error('Failed to load login logs:', error)
        } finally {
          setIsLoadingLogs(false)
        }
      } catch (error) {
        removeToken()
        navigate('/admin/login')
        toast.error('인증 실패', {
          description: '다시 로그인해주세요.',
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadAdmin()
  }, [navigate])

  const handleLogout = () => {
    removeToken()
    navigate('/admin/login')
    toast.success('로그아웃되었습니다.')
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className={`animate-spin ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          <Shield size={48} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className={`mb-6 rounded-3xl border p-8 shadow-xl backdrop-blur ${
              isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white/50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                      isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-600'
                    }`}
                  >
                    <Shield size={32} />
                  </motion.div>
                  <div>
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                      관리자 대시보드
                    </h1>
                    <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
                      환영합니다, {admin?.name || '관리자'}님
                    </p>
                  </div>
                </div>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    isDark
                      ? 'bg-slate-700 text-white hover:bg-slate-600'
                      : 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300'
                  }`}
                >
                  <LogOut size={18} />
                  로그아웃
                </motion.button>
              </div>
            </div>
          </motion.div>

          <DashboardStats />
          <AdminFeatures />
          <LoginLogs logs={loginLogs} isLoading={isLoadingLogs} />
        </div>
      </div>
    </div>
  )
}
