import apiClient from './client'

export interface OrganizationCreate {
  name: string
  type: string
}

export interface OrganizationResponse {
  id: number
  name: string
  type: string
  adminId: number
  createdAt: string
  memberCount?: number
}

export interface OrganizationMemberAdd {
  userId: string
}

export interface OrganizationMemberResponse {
  id: number
  organizationId: number
  userId: number
  userName: string
  userUserId: string
  role: string
  joinedAt: string
}

export interface OrganizationDetailResponse {
  id: number
  name: string
  type: string
  adminId: number
  createdAt: string
  members: OrganizationMemberResponse[]
}

export interface AttendanceCheckRequest {
  organizationId: number
  image: string
}

export interface AttendanceStatsResponse {
  totalMembers: number
  todayCount: number
  participationRate: number
  records: any[]
}

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

