import type { LucideIcon } from 'lucide-react'
import { useThemeStore } from '../../stores/theme-store'

interface EmptyStateProps {
  icon: LucideIcon
  message: string
  className?: string
}

export const EmptyState = ({ icon: Icon, message, className = '' }: EmptyStateProps) => {
  const { isDark } = useThemeStore()

  return (
    <div className={`flex flex-col items-center justify-center py-20 ${isDark ? 'text-slate-400' : 'text-zinc-500'} ${className}`}>
      <Icon size={48} className="mb-4 opacity-50" />
      <p>{message}</p>
    </div>
  )
}

