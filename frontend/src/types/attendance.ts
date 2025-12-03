export interface AttendanceCheckRequest {
  organizationId: number
  image: string
}

export interface AttendanceStatsResponse {
  totalMembers: number
  todayCount: number
  participationRate: number
  records: any[] // Consider defining a more specific type for records if possible
}

export interface AdminAttendanceRecord {
  id: number
  userId: number
  userName: string
  userUserId: string
  organizationName: string | null
  checkInTime: string
  similarity: string | null
  createdAt: string
}

export interface AdminAttendanceStatsItem {
  label: string
  count: number
}

export interface AdminAttendanceStats {
  daily: AdminAttendanceStatsItem[]
  hourly: AdminAttendanceStatsItem[]
  organizations: AdminAttendanceStatsItem[]
  userRanking: AdminAttendanceStatsItem[]
}

