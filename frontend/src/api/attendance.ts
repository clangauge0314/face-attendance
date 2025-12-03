import apiClient from './client'

export interface AttendanceCheckInRequest {
  image: string
}

export interface AttendanceResponse {
  id: number
  userId: number
  userName: string
  organizationType: string
  checkInTime: string
  similarity?: number
  status: string
  createdAt: string
}

export interface AttendanceListResponse {
  total: number
  items: AttendanceResponse[]
}

export const checkIn = async (data: AttendanceCheckInRequest): Promise<AttendanceResponse> => {
  const response = await apiClient.post<AttendanceResponse>('/attendance/check-in', data)
  return response.data
}

export const getAttendanceHistory = async (limit = 50, offset = 0): Promise<AttendanceListResponse> => {
  const response = await apiClient.get<AttendanceListResponse>('/attendance/history', {
    params: { limit, offset },
  })
  return response.data
}

export interface AttendanceStatsItem {
  label: string
  count: number
  date: string
  firstCheckIn?: number
}

export interface AttendanceStatsResponse {
  period: string
  items: AttendanceStatsItem[]
}

export const getAttendanceStats = async (period: 'minute' | 'hour' | 'day' | 'month' | 'year' = 'day'): Promise<AttendanceStatsResponse> => {
  const response = await apiClient.get<AttendanceStatsResponse>('/attendance/stats', {
    params: { period },
  })
  return response.data
}

