import { motion } from 'framer-motion'
import { Users, CheckCircle, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useThemeStore } from '../stores/theme-store'
import { getOrganization, getTodayAttendance, type OrganizationDetailResponse, type AttendanceStatsResponse } from '../api/organization'
import { PageHeader } from '../components/common/page-header'
import { LoadingSpinner } from '../components/common/loading-spinner'
import { StatsCard } from '../components/common/stats-card'
import { DashboardRecentRecords } from '../components/dashboard/dashboard-recent-records'

export const AttendanceDashboardPage = () => {
  const { isDark } = useThemeStore()
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
    return <LoadingSpinner />
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title={`${organization.name} 출입 현황`}
        description="오늘의 실시간 출입 현황을 확인하세요"
        backButton={{ label: "조직 관리로", to: "/admin/organizations" }}
      />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <StatsCard
              label="전체 인원"
              value={stats.totalMembers}
              icon={Users}
              iconColorClass={isDark ? 'text-slate-600' : 'text-zinc-300'}
            />

            <StatsCard
              label="오늘 출입"
              value={stats.todayCount}
              icon={CheckCircle}
              className={`${isDark ? 'border-green-900 bg-green-950/30' : 'border-green-200 bg-green-50'}`}
              valueColorClass={isDark ? 'text-green-400' : 'text-green-600'}
              iconColorClass="text-green-500"
              delay={0.1}
            />

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

          <DashboardRecentRecords records={stats.records} delay={0.3} />
        </div>
      </div>
    </div>
  )
}
