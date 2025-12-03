import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const useElectronShortcut = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI?.onNavigateToAdmin) {
      const handleNavigateToAdmin = () => {
        navigate('/admin/login')
      }

      window.electronAPI.onNavigateToAdmin(handleNavigateToAdmin)

      return () => {
        if (window.electronAPI?.removeNavigateToAdminListener) {
          window.electronAPI.removeNavigateToAdminListener(handleNavigateToAdmin)
        }
      }
    }
  }, [navigate])
}
