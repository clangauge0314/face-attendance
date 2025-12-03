import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import Webcam from 'react-webcam'
import { toast } from 'sonner'
import { useWebcam } from '../../hooks/useWebcam'
import { useCheckIn } from '../../hooks/useCheckIn'
import { useFaceDetection } from '../../hooks/useFaceDetection'
import { useFacePreview } from '../../hooks/useFacePreview'
import { useThemeStore } from '../../stores/theme-store'
import { verifyFacePreview } from '../../api/face'
import { CheckInCamera } from './CheckInCamera'
import { CheckInStatus } from './CheckInStatus'
import { CheckInActions } from './CheckInActions'
import { CameraSelector } from './CameraSelector'

interface CheckInModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  webcamRef: React.RefObject<Webcam | null>
}

export const CheckInModal = ({ isOpen, onClose, onSuccess, webcamRef }: CheckInModalProps) => {
  const { isDark } = useThemeStore()

  const {
    availableDevices,
    selectedDeviceId,
    setSelectedDeviceId,
    handleUserMedia,
    handleUserMediaError,
  } = useWebcam()

  const {
    capturedImage,
    isChecking,
    handleCheckIn,
    handleCapture,
    handleRetake,
    handleAutoCapture,
    resetCapture,
  } = useCheckIn({ onSuccess, onClose })

  const {
    similarity,
    isPreviewing,
    previewError,
    previewSimilarity,
    resetPreview,
  } = useFacePreview({
    verifyFn: (image) => verifyFacePreview({ image }),
  })

  const {
    similarity: detectedSimilarity,
    resetDetection,
  } = useFaceDetection({
    isOpen,
    capturedImage,
    webcamRef,
    onAutoCapture: (imageSrc) => {
      handleAutoCapture(imageSrc)
      previewSimilarity(imageSrc)
    },
    verifyFn: (image) => verifyFacePreview({ image }),
  })

  const onManualCapture = useCallback(() => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot()
      if (imageSrc) {
        handleCapture(imageSrc)
        previewSimilarity(imageSrc)
      }
    } catch (error) {
      console.error('Capture error:', error)
      toast.error('사진 촬영 실패', { description: '웹캠에서 이미지를 가져올 수 없습니다.' })
    }
  }, [webcamRef, handleCapture, previewSimilarity])

  const onRetake = useCallback(() => {
    handleRetake()
    resetDetection()
    resetPreview()
  }, [handleRetake, resetDetection, resetPreview])

  useEffect(() => {
    if (!isOpen) {
      resetCapture()
      resetDetection()
      resetPreview()
    }
  }, [isOpen, resetCapture, resetDetection, resetPreview])

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
              출입 기록
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

          <CameraSelector
            availableDevices={availableDevices}
            selectedDeviceId={selectedDeviceId}
            onDeviceChange={setSelectedDeviceId}
          />

          <CheckInCamera
            webcamRef={webcamRef}
            capturedImage={capturedImage}
            selectedDeviceId={selectedDeviceId}
            onUserMedia={handleUserMedia}
            onUserMediaError={handleUserMediaError}
          />

          <CheckInStatus
            similarity={currentSimilarity}
            isPreviewing={isPreviewing}
            previewError={previewError}
          />

          <CheckInActions
            capturedImage={capturedImage}
            isChecking={isChecking}
            onCapture={onManualCapture}
            onRetake={onRetake}
            onCheckIn={handleCheckIn}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
