import apiClient from './client'

export interface AdminLoginRequest {
  userId: string
  password: string
  image?: string
}

export interface AdminLoginResponse {
  access_token: string
  user: {
    id: number
    organizationType: string
    name: string
    userId: string
    createdAt: string
  }
}

export interface AdminLoginLog {
  id: number
  userId: number
  loginTime: string
  ipAddress: string | null
  userAgent: string | null
  faceVerified: string
  similarity: string | null
  status: string
  createdAt: string
  userName: string | null
  userUserId: string | null
}

export const adminLogin = async (data: AdminLoginRequest): Promise<AdminLoginResponse> => {
  const response = await apiClient.post<AdminLoginResponse>('/admin/login', data)
  return response.data
}

export const getAdminMe = async () => {
  const response = await apiClient.get('/admin/me')
  return response.data
}

export const getAdminLoginLogs = async (limit = 100, offset = 0): Promise<AdminLoginLog[]> => {
  const response = await apiClient.get<AdminLoginLog[]>('/admin/login-logs', {
    params: { limit, offset },
  })
  return response.data
}

export interface AdminFacePreviewRequest {
  userId: string
  image: string
}

export interface AdminFacePreviewResponse {
  similarity: number
  verified: boolean
}

export const previewAdminFace = async (data: AdminFacePreviewRequest): Promise<AdminFacePreviewResponse> => {
  const response = await apiClient.post<AdminFacePreviewResponse>('/admin/face-preview', data)
  return response.data
}

export interface AdminDashboardStats {
  totalUsers: number
  todayEntries: number
  thisMonthEntries: number
}

export const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  const response = await apiClient.get<AdminDashboardStats>('/admin/dashboard-stats')
  return response.data
}

export interface AdminUser {
  id: number
  name: string
  userId: string
  organizationType: string
  role: string
  createdAt: string
  faceDataRegistered: boolean
}

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const response = await apiClient.get<AdminUser[]>('/admin/users')
  return response.data
}

export const deleteUser = async (userId: number): Promise<void> => {
  await apiClient.delete(`/admin/users/${userId}`)
}

export const resetUserPassword = async (userId: number): Promise<void> => {
  await apiClient.put(`/admin/users/${userId}/password`)
}

export const deleteUserFaceData = async (userId: number): Promise<void> => {
  await apiClient.delete(`/admin/users/${userId}/face`)
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

export const getAdminAttendanceHistory = async (
  limit = 100, 
  offset = 0,
  startDate?: string,
  endDate?: string,
  query?: string
): Promise<AdminAttendanceRecord[]> => {
  const params: any = { limit, offset }
  if (startDate) params.start_date = startDate
  if (endDate) params.end_date = endDate
  if (query) params.query = query
  
  const response = await apiClient.get<AdminAttendanceRecord[]>('/admin/attendance-history', { params })
  return response.data
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

export const getAdminAttendanceStats = async (): Promise<AdminAttendanceStats> => {
  const response = await apiClient.get<AdminAttendanceStats>('/admin/attendance-stats')
  return response.data
}
