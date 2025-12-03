import { Loader2 } from 'lucide-react'
import { useThemeStore } from '../../stores/theme-store'

interface CheckInStatusProps {
  similarity: number | null
  isPreviewing: boolean
  previewError: string | null
}

export const CheckInStatus = ({ similarity, isPreviewing, previewError }: CheckInStatusProps) => {
  const { isDark } = useThemeStore()

  return (
    <div
      className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${
        isDark ? 'border-slate-800 bg-slate-900/80 text-slate-200' : 'border-zinc-200 bg-zinc-50 text-zinc-700'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold">실시간 상태</span>
        {isPreviewing && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>얼굴 감지</span>
          <p className={`font-bold ${similarity !== null ? 'text-green-500' : 'text-red-500'}`}>
            {similarity !== null ? '감지됨' : '미감지'}
          </p>
        </div>
        <div className="text-right">
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>유사도</span>
          <p className="font-bold">{similarity !== null ? `${similarity.toFixed(1)}%` : '--'}</p>
        </div>
      </div>
      {previewError ? (
        <p className="mt-2 text-xs text-red-400">{previewError}</p>
      ) : (
        <p className="mt-2 text-xs text-slate-400">기준 70% 이상일 때 인증에 성공합니다.</p>
      )}
    </div>
  )
}

