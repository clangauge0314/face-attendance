import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { useThemeStore } from '../../stores/theme-store'

interface StatsCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  iconColorClass?: string
  valueColorClass?: string
  delay?: number
  className?: string
}

export const StatsCard = ({ 
  label, 
  value, 
  icon: Icon, 
  iconColorClass, 
  valueColorClass, 
  delay = 0,
  className = ''
}: StatsCardProps) => {
  const { isDark } = useThemeStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-3xl border p-6 ${
        isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
            {label}
          </div>
          <div className={`mt-2 text-3xl font-bold ${valueColorClass || (isDark ? 'text-white' : 'text-zinc-900')}`}>
            {value}
          </div>
        </div>
        <Icon className={iconColorClass || (isDark ? 'text-slate-600' : 'text-zinc-300')} size={40} />
      </div>
    </motion.div>
  )
}

