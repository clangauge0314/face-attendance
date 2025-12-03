import { motion } from 'framer-motion'
import { Users, Clock, CheckCircle, TrendingUp, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useThemeStore } from '../stores/theme-store'
import { getOrganization, getTodayAttendance, type OrganizationDetailResponse, type AttendanceStatsResponse } from '../api/organization'

export const AttendanceDashboardPage = () => {
  const { isDark } = useThemeStore()
  const navigate = useNavigate()
  const { organizationId } = useParams<{ organizationId: string }>()
  const [organization, setOrganization] = useState<OrganizationDetailResponse | null>(null)
  const [stats, setStats] = useState<AttendanceStatsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (organizationId) {
      loadData()
    }
  }, [organizationId])

  useEffect(() => {
    if (!organizationId) return

    const interval = setInterval(() => {
      loadData()
    }, 10000)

    return () => clearInterval(interval)
  }, [organizationId])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const orgId = parseInt(organizationId!)
      const [orgData, statsData] = await Promise.all([
        getOrganization(orgId),
        getTodayAttendance(orgId),
      ])
      setOrganization(orgData)
      setStats(statsData)
    } catch (error) {
      toast.error('데이터 로드 실패')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !organization || !stats) {
    return (
      <div className="flex h-full items-center justify-center">
        <Clock className={`animate-spin ${isDark ? 'text-white' : 'text-zinc-900'}`} size={48} />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className={`border-b px-8 py-6 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white/50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {organization.name} 출입 현황
            </h1>
            <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
              오늘의 실시간 출입 현황을 확인하세요
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/organizations')}
            className={`rounded-xl px-4 py-2 font-semibold transition-colors ${
              isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300'
            }`}
          >
            조직 관리로
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-3xl border p-6 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>전체 인원</div>
                  <div className={`mt-2 text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {stats.totalMembers}
                  </div>
                </div>
                <Users className={isDark ? 'text-slate-600' : 'text-zinc-300'} size={40} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`rounded-3xl border p-6 ${isDark ? 'border-green-900 bg-green-950/30' : 'border-green-200 bg-green-50'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>오늘 출입</div>
                  <div className={`mt-2 text-3xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    {stats.todayCount}
                  </div>
                </div>
                <CheckCircle className="text-green-500" size={40} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`col-span-2 rounded-3xl border p-6 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'}`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>참여율</div>
                  <div className={`mt-2 text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {stats.participationRate.toFixed(1)}%
                  </div>
                </div>
                <TrendingUp className={isDark ? 'text-slate-400' : 'text-zinc-500'} size={40} />
              </div>
              <div className="relative h-4 overflow-hidden rounded-full bg-slate-800/20">
                <div
                  className="h-full bg-gradient-to-r from-green-600 to-green-500 transition-all duration-500"
                  style={{ width: `${stats.participationRate}%` }}
                />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-3xl border p-6 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'}`}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                오늘의 출입 기록
              </h2>
              <Calendar className={isDark ? 'text-slate-400' : 'text-zinc-500'} size={20} />
            </div>

            <div className="space-y-2">
              {stats.records.map((record: any) => (
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
        </div>
      </div>
    </div>
  )
}

