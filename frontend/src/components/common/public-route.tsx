import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    navigate('/', { replace: true })
    return null
  }

  return <>{children}</>
}

