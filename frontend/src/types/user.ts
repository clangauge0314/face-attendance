export interface SignupRequest {
  organizationType: string
  organizationId?: number
  name: string
  userId: string
  password: string
}

export interface LoginRequest {
  userId: string
  password: string
}

export interface UserResponse {
  id: number
  organizationType: string
  name: string
  userId: string
  role: string
  createdAt: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  user: UserResponse
}

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

export interface AdminUser {
  id: number
  name: string
  userId: string
  organizationType: string
  role: string
  createdAt: string
  faceDataRegistered: boolean
}

export interface AdminDashboardStats {
  totalUsers: number
  todayEntries: number
  thisMonthEntries: number
}

export interface AdminFacePreviewRequest {
  userId: string
  image: string
}

export interface AdminFacePreviewResponse {
  similarity: number
  verified: boolean
}

