import { useCallback, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { Loader2 } from 'lucide-react'
import { FaceRegistrationForm } from '../components/face/face-registration-form'
import { UserProfile } from '../components/auth/user-profile'
import { AttendanceSection } from '../components/attendance/attendance-section'
import { CheckInModal } from '../components/attendance/check-in-modal'
import { useFaceDetection } from '../hooks/useFaceDetection'
import { useFaceRegistration } from '../hooks/useFaceRegistration'
import { useWebcam } from '../hooks/useWebcam'
import { useAuth } from '../hooks/useAuth'
import { useThemeStore } from '../stores/theme-store'

const HomePage = () => {
  const { user, logout } = useAuth()
  const { isDark } = useThemeStore()
  const webcamRef = useRef<Webcam>(null)
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false)
  const [refreshHistory, setRefreshHistory] = useState(0)

  const {
    hasFaceData,
    isRegistering,
    capturedImage,
    checkFaceData,
    capture,
    retake,
    registerFace,
  } = useFaceRegistration()

  const {
    webcamError,
    availableDevices,
    selectedDeviceId,
    isLoadingDevices,
    setSelectedDeviceId,
    handleUserMedia,
    handleUserMediaError,
    requestCameraPermission,
  } = useWebcam()

  const handleAutoCapture = useCallback(
    (imageSrc: string) => {
      capture(imageSrc)
    },
    [capture]
  )

  const { resetDetection } = useFaceDetection({
    enabled: !hasFaceData && !capturedImage && !webcamError && !isLoadingDevices,
    webcamRef: webcamRef as React.RefObject<Webcam>,
    onDetected: handleAutoCapture,
  })

  useEffect(() => {
    checkFaceData()
  }, [checkFaceData])

  const handleCapture = useCallback(() => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot()
      if (imageSrc) {
        console.log('Image captured successfully')
        capture(imageSrc)
      }
    } catch (error) {
      console.error('Capture error:', error)
    }
  }, [capture])

  const handleRetake = useCallback(() => {
    retake()
    resetDetection()
  }, [retake, resetDetection])

  const handleCheckInSuccess = () => {
    setRefreshHistory((prev) => prev + 1)
  }

  if (hasFaceData === null) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className={`animate-spin ${isDark ? 'text-white' : 'text-zinc-900'}`} size={48} />
      </div>
    )
  }

  if (!hasFaceData) {
    return (
      <FaceRegistrationForm
        webcamRef={webcamRef as React.RefObject<Webcam>}
        capturedImage={capturedImage}
        isRegistering={isRegistering}
        webcamError={webcamError}
        availableDevices={availableDevices}
        selectedDeviceId={selectedDeviceId}
        isLoadingDevices={isLoadingDevices}
        onDeviceChange={setSelectedDeviceId}
        onCapture={handleCapture}
        onRetake={handleRetake}
        onRegister={registerFace}
        onRequestPermission={requestCameraPermission}
        onUserMedia={handleUserMedia}
        onUserMediaError={handleUserMediaError}
      />
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl">
          <UserProfile user={user} logout={logout} />
          
          <AttendanceSection
            onCheckInClick={() => setIsCheckInModalOpen(true)}
            refreshHistoryKey={refreshHistory}
          />
        </div>
      </div>

      <CheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        onSuccess={handleCheckInSuccess}
        webcamRef={webcamRef}
      />
    </div>
  )
}

export default HomePage
