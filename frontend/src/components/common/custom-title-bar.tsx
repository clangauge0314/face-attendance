import { Minus, Square, X } from 'lucide-react'
import { useThemeStore } from '../../stores/theme-store'

const CustomTitleBar = () => {
  const { isDark } = useThemeStore()

  const handleMinimize = () => window.electronAPI?.minimize?.()
  const handleMaximize = () => window.electronAPI?.maximize?.()
  const handleClose = () => window.electronAPI?.close?.()

  const buttonClass = isDark
    ? 'text-slate-100 hover:bg-white/10'
    : 'text-zinc-700 hover:bg-zinc-200/70'

  return (
    <div
      className={`fixed inset-x-0 top-0 flex h-12 items-center justify-between px-4 ${
        isDark
          ? 'bg-linear-to-r from-[#05070f]/90 via-[#0e1426]/70 to-[#05070f]/90 text-slate-100 backdrop-blur'
          : 'bg-white/80 text-zinc-800 backdrop-blur'
      }`}
      style={{ WebkitAppRegion: 'drag' }}
    >
      <div className='text-xs font-semibold uppercase tracking-[0.35em]'>Face Attendance</div>

      <div className='flex items-center gap-2' style={{ WebkitAppRegion: 'no-drag' }}>
        <button aria-label='창 최소화' className={`rounded-md p-2 transition ${buttonClass}`} onClick={handleMinimize}>
          <Minus size={16} />
        </button>
        <button aria-label='창 최대화' className={`rounded-md p-2 transition ${buttonClass}`} onClick={handleMaximize}>
          <Square size={14} />
        </button>
        <button
          aria-label='창 닫기'
          className='rounded-md p-2 transition hover:bg-red-500/80 hover:text-white'
          onClick={handleClose}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

export default CustomTitleBar

