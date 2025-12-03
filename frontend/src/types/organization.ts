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

