import apiClient from './client'
import type {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminLoginLog,
  AdminFacePreviewRequest,
  AdminFacePreviewResponse,
  AdminDashboardStats,
  AdminUser,
  AdminAttendanceRecord,
  AdminAttendanceStats,
} from '../types/user'
import type { AttendanceStatsResponse } from '../types/attendance' // Fix: Import correct types

// Re-export types for backward compatibility if needed, or better update consumers
export type {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminLoginLog,
  AdminFacePreviewRequest,
  AdminFacePreviewResponse,
  AdminDashboardStats,
  AdminUser,
  AdminAttendanceRecord,
  AdminAttendanceStats
} 

// Note: AdminAttendanceRecord and Stats were moved to attendance.ts or user.ts depending on logic.
// Let's check where I put them. 
// AdminAttendanceRecord -> attendance.ts
// AdminAttendanceStats -> attendance.ts
// Wait, I put them in attendance.ts in previous step? Let me double check.
// I put AdminLogin... in user.ts
// AdminDashboardStats in user.ts
// AdminUser in user.ts
// AdminAttendanceRecord in attendance.ts
// AdminAttendanceStats in attendance.ts

import type {
    AdminAttendanceRecord as _AdminAttendanceRecord,
    AdminAttendanceStats as _AdminAttendanceStats
} from '../types/attendance'

// Correcting re-exports based on where I actually put them
export type AdminAttendanceRecord = _AdminAttendanceRecord
export type AdminAttendanceStats = _AdminAttendanceStats


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

export const previewAdminFace = async (data: AdminFacePreviewRequest): Promise<AdminFacePreviewResponse> => {
  const response = await apiClient.post<AdminFacePreviewResponse>('/admin/face-preview', data)
  return response.data
}

export const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  const response = await apiClient.get<AdminDashboardStats>('/admin/dashboard-stats')
  return response.data
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

export const getAdminAttendanceStats = async (): Promise<AdminAttendanceStats> => {
  const response = await apiClient.get<AdminAttendanceStats>('/admin/attendance-stats')
  return response.data
}
