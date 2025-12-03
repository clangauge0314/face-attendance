import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '../../stores/theme-store'

interface PageHeaderProps {
  title: string
  description?: string
  backButton?: {
    label: string
    to: string
  }
  children?: React.ReactNode
}

export const PageHeader = ({ title, description, backButton, children }: PageHeaderProps) => {
  const { isDark } = useThemeStore()
  const navigate = useNavigate()

  return (
    <div className={`border-b px-8 py-6 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white/50'}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            {title}
          </h1>
          {description && (
            <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {children}
          {backButton && (
            <button
              onClick={() => navigate(backButton.to)}
              className={`rounded-xl px-4 py-2 font-semibold transition-colors ${
                isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300'
              }`}
            >
              {backButton.label}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

