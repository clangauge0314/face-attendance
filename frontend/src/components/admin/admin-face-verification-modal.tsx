import { motion, AnimatePresence } from 'framer-motion'
import { Camera, CheckCircle, Loader2, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { toast } from 'sonner'
import { previewAdminFace } from '../../api/admin'
import { useWebcam } from '../../hooks/useWebcam'
import { useFaceDetection } from '../../hooks/useFaceDetection'
import { useFacePreview } from '../../hooks/useFacePreview'
import { useThemeStore } from '../../stores/theme-store'

interface AdminFaceVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerified: (imageSrc: string) => void
  webcamRef: React.RefObject<Webcam | null>
  userId: string
}

export const AdminFaceVerificationModal = ({
  isOpen,
  onClose,
  onVerified,
  webcamRef,
  userId,
}: AdminFaceVerificationModalProps) => {
  const { isDark } = useThemeStore()
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const {
    availableDevices,
    selectedDeviceId,
    setSelectedDeviceId,
    handleUserMedia,
    handleUserMediaError,
  } = useWebcam()

  const {
    similarity,
    isPreviewing,
    previewError,
    previewSimilarity,
    resetPreview,
  } = useFacePreview({
    verifyFn: async (image) => {
        if (!userId) {
            throw new Error('아이디를 입력해주세요.')
        }
        return previewAdminFace({ userId, image })
    },
    onSuccess: (imageSrc) => {
        // 인증 성공 시 자동으로 완료 처리
        setTimeout(() => {
            onVerified(imageSrc)
        }, 800)
    }
  })

  const handleAutoCapture = useCallback(
    (imageSrc: string) => {
      setCapturedImage(imageSrc)
      toast.success('얼굴이 감지되어 촬영되었습니다.', { duration: 2000 })
      previewSimilarity(imageSrc)
    },
    [previewSimilarity],
  )

  const {
    similarity: detectedSimilarity,
    resetDetection,
  } = useFaceDetection({
    isOpen,
    capturedImage,
    webcamRef,
    onAutoCapture: handleAutoCapture,
    verifyFn: async (image) => {
        if (!userId) return { similarity: 0, verified: false, detected: false }
        return previewAdminFace({ userId, image })
    }
  })

  const handleCapture = useCallback(() => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot()
      if (imageSrc) {
        setCapturedImage(imageSrc)
        previewSimilarity(imageSrc)
      }
    } catch (error) {
      console.error('Capture error:', error)
      toast.error('사진 촬영 실패', { description: '웹캠에서 이미지를 가져올 수 없습니다.' })
    }
  }, [webcamRef, previewSimilarity])

  const handleVerify = () => {
    if (!capturedImage) return
    onVerified(capturedImage)
  }

  const handleRetake = () => {
    setCapturedImage(null)
    resetPreview()
    resetDetection()
  }

  useEffect(() => {
    if (!isOpen) {
      handleRetake()
    }
  }, [isOpen])

  if (!isOpen) return null

  const currentSimilarity = capturedImage ? similarity : detectedSimilarity

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative z-10 w-full max-w-md rounded-3xl border p-6 shadow-2xl backdrop-blur ${
            isDark ? 'border-slate-800 bg-slate-900/95' : 'border-zinc-200 bg-white/95'
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              관리자 얼굴 인증
            </h2>
            <button
              onClick={onClose}
              className={`rounded-lg p-2 transition-colors ${
                isDark ? 'hover:bg-slate-800' : 'hover:bg-zinc-100'
              }`}
            >
              <X size={20} className={isDark ? 'text-slate-400' : 'text-zinc-600'} />
            </button>
          </div>

          {availableDevices.length > 1 && (
            <div className="mb-4">
              <label className={`mb-2 block text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-zinc-700'}`}>
                카메라 선택
              </label>
              <select
                value={selectedDeviceId || ''}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
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

          <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-2xl bg-black">
            {!capturedImage ? (
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
                onUserMedia={handleUserMedia}
                onUserMediaError={handleUserMediaError}
              />
            ) : (
              <img src={capturedImage} alt="Captured" className="h-full w-full object-cover" />
            )}
          </div>

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
                <p className={`font-bold ${currentSimilarity !== null ? 'text-green-500' : 'text-slate-400'}`}>
                  {currentSimilarity !== null ? '감지됨' : '미감지'}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>유사도</span>
                <p className="font-bold">{currentSimilarity !== null ? `${currentSimilarity.toFixed(1)}%` : '--'}</p>
              </div>
            </div>
            {previewError ? (
              <p className="mt-2 text-xs text-red-400">{previewError}</p>
            ) : (
              <p className="mt-2 text-xs text-slate-400">기준 70% 이상일 때 인증에 성공합니다.</p>
            )}
          </div>

          <div className="flex gap-3">
            {!capturedImage ? (
              <>
                <button
                  onClick={handleCapture}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all active:scale-[0.98] ${
                    isDark
                      ? 'bg-blue-600 text-white hover:bg-blue-500'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
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
                  onClick={handleRetake}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all active:scale-[0.98] ${
                    isDark
                      ? 'bg-slate-700 text-white hover:bg-slate-600'
                      : 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300'
                  }`}
                >
                  재촬영
                </button>
                <button
                  onClick={handleVerify}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all active:scale-[0.98] ${
                    isDark
                      ? 'bg-red-600 text-white hover:bg-red-500'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  <CheckCircle size={20} />
                  인증 확인
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
