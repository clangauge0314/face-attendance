import { motion } from 'framer-motion'
import { Users, TrendingUp, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getAdminDashboardStats, getAdminAttendanceStats, type AdminDashboardStats, type AdminAttendanceStats } from '../api/admin'
import { PageHeader } from '../components/common/page-header'
import { LoadingSpinner } from '../components/common/loading-spinner'
import { StatsCard } from '../components/common/stats-card'
import { DailyTrendChart } from '../components/stats/daily-trend-chart'
import { HourlyAttendanceChart } from '../components/stats/hourly-attendance-chart'
import { OrganizationParticipationChart } from '../components/stats/organization-participation-chart'
import { UserRankingChart } from '../components/stats/user-ranking-chart'

export const StatsAnalysisPage = () => {
  const [dashboardStats, setDashboardStats] = useState<AdminDashboardStats | null>(null)
  const [chartStats, setChartStats] = useState<AdminAttendanceStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [dashData, chartData] = await Promise.all([
        getAdminDashboardStats(),
        getAdminAttendanceStats()
      ])
      setDashboardStats(dashData)
      setChartStats(chartData)
    } catch (error) {
      toast.error('통계 데이터 로드 실패')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader 
        title="통계 및 분석" 
        description="시스템 전체 현황을 분석합니다"
        backButton={{ label: "대시보드로", to: "/admin" }}
      />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl space-y-8">
          
          {/* 주요 지표 카드 */}
          <div className="grid gap-6 md:grid-cols-3">
            <StatsCard
              label="총 사용자"
              value={dashboardStats?.totalUsers.toLocaleString() || '0'}
              icon={Users}
              iconColorClass="text-blue-500"
            />

            <StatsCard
              label="오늘 출입"
              value={dashboardStats?.todayEntries.toLocaleString() || '0'}
              icon={Clock}
              valueColorClass="text-green-600 dark:text-green-400"
              iconColorClass="text-green-500"
              delay={0.1}
            />

            <StatsCard
              label="이번 달 출입"
              value={dashboardStats?.thisMonthEntries.toLocaleString() || '0'}
              icon={TrendingUp}
              valueColorClass="text-purple-600 dark:text-purple-400"
              iconColorClass="text-purple-500"
              delay={0.2}
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <DailyTrendChart data={chartStats?.daily || []} delay={0.3} />
            <HourlyAttendanceChart data={chartStats?.hourly || []} delay={0.4} />
            <OrganizationParticipationChart data={chartStats?.organizations || []} delay={0.5} />
            <UserRankingChart data={chartStats?.userRanking || []} delay={0.6} />
          </div>

        </div>
      </div>
    </div>
  )
}
