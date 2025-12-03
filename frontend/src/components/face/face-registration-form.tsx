import { AlertCircle, Camera, CheckCircle, Loader2, RefreshCw } from 'lucide-react'
import Webcam from 'react-webcam'
import { useThemeStore } from '../../stores/theme-store'

interface FaceRegistrationFormProps {
  webcamRef: React.RefObject<Webcam | null>
  capturedImage: string | null
  isRegistering: boolean
  webcamError: string | null
  availableDevices: Array<{ deviceId: string; label: string }>
  selectedDeviceId: string | undefined
  isLoadingDevices: boolean
  onDeviceChange: (deviceId: string) => void
  onCapture: () => void
  onRetake: () => void
  onRegister: () => void
  onRequestPermission: () => void
  onUserMedia: () => void
  onUserMediaError: (error: string | DOMException) => void
  title?: string
  description?: string
  fullHeight?: boolean
  containerClassName?: string
}

export const FaceRegistrationForm = ({
  webcamRef,
  capturedImage,
  isRegistering,
  webcamError,
  availableDevices,
  selectedDeviceId,
  isLoadingDevices,
  onDeviceChange,
  onCapture,
  onRetake,
  onRegister,
  onRequestPermission,
  onUserMedia,
  onUserMediaError,
  title = '얼굴 데이터 등록',
  description = '카메라를 바라보면 자동으로 촬영됩니다.',
  fullHeight = true,
  containerClassName = '',
}: FaceRegistrationFormProps) => {
  const { isDark } = useThemeStore()

  const containerClasses = [
    'flex flex-col items-center justify-center p-4',
    fullHeight ? 'min-h-[calc(100vh-3rem)]' : '',
    containerClassName,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={containerClasses}>
      <div
        className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl backdrop-blur ${
          isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white/50'
        }`}
      >
        <div className="mb-6 text-center">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{title}</h2>
          <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>{description}</p>
        </div>

        {availableDevices.length > 1 && (
          <div className="mb-4">
            <label className={`mb-2 block text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-zinc-700'}`}>
              카메라 선택
            </label>
            <select
              value={selectedDeviceId || ''}
              onChange={(e) => onDeviceChange(e.target.value)}
              className={`w-full rounded-xl border px-3 py-2 text-sm ${
                isDark
                  ? 'border-slate-700 bg-slate-800 text-white'
                  : 'border-zinc-300 bg-white text-zinc-900'
              }`}
            >
              {availableDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {webcamError && (
          <div className={`mb-4 rounded-xl border p-4 ${
            isDark ? 'border-red-800 bg-red-900/20' : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-start gap-3">
              <AlertCircle className={`mt-0.5 shrink-0 ${isDark ? 'text-red-400' : 'text-red-600'}`} size={20} />
              <div className="flex-1">
                <p className={`text-sm font-semibold ${isDark ? 'text-red-300' : 'text-red-800'}`}>
                  웹캠 오류
                </p>
                <p className={`mt-1 text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  {webcamError}
                </p>
                <button
                  onClick={onRequestPermission}
                  className={`mt-3 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    isDark
                      ? 'bg-red-800 text-white hover:bg-red-700'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  권한 다시 요청
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-2xl bg-black">
          {isLoadingDevices ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="animate-spin text-white" size={32} />
            </div>
          ) : !capturedImage ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="h-full w-full object-cover"
              mirrored
              videoConstraints={{
                deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
                width: { ideal: 1280 },
                height: { ideal: 720 },
              }}
              onUserMedia={onUserMedia}
              onUserMediaError={onUserMediaError}
            />
          ) : (
            <img src={capturedImage} alt="Captured" className="h-full w-full object-cover" />
          )}
        </div>

        <div className="flex gap-3">
          {!capturedImage ? (
            <button
              onClick={onCapture}
              disabled={!!webcamError || isLoadingDevices}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all active:scale-[0.98] ${
                isDark ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-600 text-white hover:bg-blue-700'
              } ${webcamError || isLoadingDevices ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <Camera size={20} />
              수동 촬영
            </button>
          ) : (
            <>
              <button
                onClick={onRetake}
                disabled={isRegistering}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all active:scale-[0.98] ${
                  isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300'
                }`}
              >
                <RefreshCw size={20} />
                재촬영
              </button>
              <button
                onClick={onRegister}
                disabled={isRegistering}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all active:scale-[0.98] ${
                  isDark ? 'bg-green-600 text-white hover:bg-green-500' : 'bg-green-600 text-white hover:bg-green-700'
                } ${isRegistering ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    등록 중...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    등록하기
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

