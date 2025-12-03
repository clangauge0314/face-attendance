import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginAPI, signup as signupAPI, getMe, type LoginRequest, type SignupRequest, type UserResponse } from '../api/auth'
import { setToken, getToken, removeToken } from '../utils/local-storage'

interface AuthState {
  user: UserResponse | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const useAuth = () => {
  const navigate = useNavigate()
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  const loadUser = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
      return
    }

    try {
      const user = await getMe()
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      removeToken()
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  }, [])

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        const response = await loginAPI(credentials)
        setToken(response.access_token)
        setAuthState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
        })
        return response
      } catch (error: any) {
        throw new Error(error.response?.data?.detail || '로그인에 실패했습니다.')
      }
    },
    []
  )

  const signup = useCallback(async (data: SignupRequest) => {
    try {
      const user = await signupAPI(data)
      return user
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || '회원가입에 실패했습니다.')
    }
  }, [])

  const logout = useCallback(() => {
    removeToken()
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
    navigate('/login')
  }, [navigate])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  return {
    ...authState,
    login,
    signup,
    logout,
    loadUser,
  }
}
