import apiClient from './client'
import type { SignupRequest, LoginRequest, UserResponse, TokenResponse } from '../types/user'

// Re-export for backward compatibility
export type { SignupRequest, LoginRequest, UserResponse, TokenResponse }

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
