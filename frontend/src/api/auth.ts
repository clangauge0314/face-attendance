import apiClient from './client'

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

export const signup = async (data: SignupRequest): Promise<UserResponse> => {
  const response = await apiClient.post<UserResponse>('/auth/signup', data)
  return response.data
}

export const login = async (data: LoginRequest): Promise<TokenResponse> => {
  const response = await apiClient.post<TokenResponse>('/auth/login', data)
  return response.data
}

export const getMe = async (): Promise<UserResponse> => {
  const response = await apiClient.get<UserResponse>('/auth/me')
  return response.data
}
