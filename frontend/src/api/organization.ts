import apiClient from './client'
import type {
  OrganizationCreate,
  OrganizationResponse,
  OrganizationMemberAdd,
  OrganizationMemberResponse,
  OrganizationDetailResponse,
} from '../types/organization'
import type { AttendanceStatsResponse, AttendanceCheckRequest } from '../types/attendance'

// Re-export for backward compatibility
export type {
  OrganizationCreate,
  OrganizationResponse,
  OrganizationMemberAdd,
  OrganizationMemberResponse,
  OrganizationDetailResponse,
}
export type { AttendanceStatsResponse, AttendanceCheckRequest }

export const createOrganization = async (data: OrganizationCreate): Promise<OrganizationResponse> => {
  const response = await apiClient.post<OrganizationResponse>('/organizations', data)
  return response.data
}

export const listOrganizations = async (): Promise<OrganizationResponse[]> => {
  const response = await apiClient.get<OrganizationResponse[]>('/organizations')
  return response.data
}

export const listOrganizationsPublic = async (): Promise<OrganizationResponse[]> => {
  const response = await apiClient.get<OrganizationResponse[]>('/organizations/public')
  return response.data
}

export const getOrganization = async (id: number): Promise<OrganizationDetailResponse> => {
  const response = await apiClient.get<OrganizationDetailResponse>(`/organizations/${id}`)
  return response.data
}

export const addMember = async (organizationId: number, data: OrganizationMemberAdd): Promise<OrganizationMemberResponse> => {
  const response = await apiClient.post<OrganizationMemberResponse>(`/organizations/${organizationId}/members`, data)
  return response.data
}

export const removeMember = async (organizationId: number, memberId: number): Promise<void> => {
  await apiClient.delete(`/organizations/${organizationId}/members/${memberId}`)
}

export const getTodayAttendance = async (organizationId: number): Promise<AttendanceStatsResponse> => {
  const response = await apiClient.get<AttendanceStatsResponse>(`/organizations/${organizationId}/attendance/today`)
  return response.data
}

export const checkAttendance = async (data: AttendanceCheckRequest): Promise<any> => {
  const response = await apiClient.post('/attendance/check-attendance', data)
  return response.data
}

export const getUserOrganizations = async (): Promise<OrganizationResponse[]> => {
  const response = await apiClient.get<OrganizationResponse[]>('/users/organizations')
  return response.data
}
