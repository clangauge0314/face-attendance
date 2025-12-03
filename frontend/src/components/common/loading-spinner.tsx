import { Loader2 } from 'lucide-react'
import { useThemeStore } from '../../stores/theme-store'

interface LoadingSpinnerProps {
  fullScreen?: boolean
  size?: number
  className?: string
}

export const LoadingSpinner = ({ fullScreen = true, size = 48, className = '' }: LoadingSpinnerProps) => {
  const { isDark } = useThemeStore()

  const content = (
    <div className={`animate-spin ${isDark ? 'text-white' : 'text-zinc-900'} ${className}`}>
      <Loader2 size={size} />
    </div>
  )

  if (fullScreen) {
    return (
      <div className="flex h-full items-center justify-center">
        {content}
      </div>
    )
  }

  return content
}

