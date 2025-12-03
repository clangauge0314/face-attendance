import { Camera, CheckCircle, Loader2 } from 'lucide-react'
import { useThemeStore } from '../../stores/theme-store'

interface CheckInActionsProps {
  capturedImage: string | null
  isChecking: boolean
  onCapture: () => void
  onRetake: () => void
  onCheckIn: () => void
}

export const CheckInActions = ({
  capturedImage,
  isChecking,
  onCapture,
  onRetake,
  onCheckIn,
}: CheckInActionsProps) => {
  const { isDark } = useThemeStore()

  return (
    <div className="flex gap-3">
      {!capturedImage ? (
        <>
          <button
            onClick={onCapture}
            disabled={isChecking}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all active:scale-[0.98] ${
              isDark
                ? 'bg-blue-600 text-white hover:bg-blue-500'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } ${isChecking ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <Camera size={20} />
            수동 촬영
          </button>
          <div className={`flex flex-1 items-center justify-center rounded-xl py-3 text-sm ${
            isDark ? 'bg-slate-800 text-slate-400' : 'bg-zinc-100 text-zinc-500'
          }`}>
            자동 감지 중...
          </div>
        </>
      ) : (
        <>
          <button
            onClick={onRetake}
            disabled={isChecking}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all active:scale-[0.98] ${
              isDark
                ? 'bg-slate-700 text-white hover:bg-slate-600'
                : 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300'
            }`}
          >
            재촬영
          </button>
          <button
            onClick={onCheckIn}
            disabled={isChecking}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all active:scale-[0.98] ${
              isDark
                ? 'bg-green-600 text-white hover:bg-green-500'
                : 'bg-green-600 text-white hover:bg-green-700'
            } ${isChecking ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {isChecking ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                인증 중...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                출입 기록
              </>
            )}
          </button>
        </>
      )}
    </div>
  )
}

