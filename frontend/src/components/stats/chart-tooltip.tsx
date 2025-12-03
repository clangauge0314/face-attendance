import { useThemeStore } from '../../stores/theme-store'

export const ChartTooltip = ({ active, payload, label }: any) => {
  const { isDark } = useThemeStore()
  
  if (active && payload && payload.length) {
    return (
      <div className={`rounded-lg border p-3 shadow-lg ${
        isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-zinc-200 bg-white text-zinc-900'
      }`}>
        <p className="mb-1 text-sm font-bold">{label}</p>
        <p className="text-sm">
          값: <span className="font-bold text-blue-500">{payload[0].value}</span>
        </p>
      </div>
    )
  }
  return null
}

