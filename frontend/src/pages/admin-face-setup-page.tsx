import { motion } from 'framer-motion'
import { Shield, Video } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import Webcam from 'react-webcam'
import { useNavigate } from 'react-router-dom'
import { FaceRegistrationForm } from '../components/face/face-registration-form'
import { useFaceDetection } from '../hooks/useFaceDetection'
import { useFaceRegistration } from '../hooks/useFaceRegistration'
import { useWebcam } from '../hooks/useWebcam'
import { useThemeStore } from '../stores/theme-store'

export const AdminFaceSetupPage = () => {
  const { isDark } = useThemeStore()
  const navigate = useNavigate()
  const webcamRef = useRef<Webcam>(null)

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
    [capture],
  )

  const { resetDetection } = useFaceDetection({
    enabled: !hasFaceData && !capturedImage && !webcamError && !isLoadingDevices,
    webcamRef: webcamRef as React.RefObject<Webcam>,
    onDetected: handleAutoCapture,
  })

  const handleCapture = useCallback(() => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot()
      if (imageSrc) {
        capture(imageSrc)
      }
    } catch (error) {
      console.error('Admin face setup capture error:', error)
    }
  }, [capture])

  const handleRetake = useCallback(() => {
    retake()
    resetDetection()
  }, [retake, resetDetection])

  const handleRegister = useCallback(async () => {
    await registerFace()
    await checkFaceData()
  }, [registerFace, checkFaceData])

  useEffect(() => {
    checkFaceData()
  }, [checkFaceData])

  useEffect(() => {
    if (hasFaceData) {
      navigate('/admin')
    }
  }, [hasFaceData, navigate])

  if (hasFaceData === null) {
    return (
      <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
        <div className={`animate-spin ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          <Shield size={48} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3rem)] px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-6 shadow-xl backdrop-blur ${
            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-zinc-200 bg-white/70'
          }`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                  isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-600'
                }`}
              >
                <Shield size={28} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  관리자 얼굴 등록
                </h1>
                <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-zinc-600'}`}>
                  관리자 대시보드를 사용하기 전에 얼굴 데이터를 등록해주세요.
                </p>
              </div>
            </div>
            <div
              className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium ${
                isDark ? 'bg-slate-800 text-slate-300' : 'bg-zinc-100 text-zinc-700'
              }`}
            >
              <Video size={16} />
              자동 촬영 모드 활성화
            </div>
          </div>
        </motion.div>

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
          onRegister={handleRegister}
          onRequestPermission={requestCameraPermission}
          onUserMedia={handleUserMedia}
          onUserMediaError={handleUserMediaError}
          title="얼굴 데이터 등록"
          description="카메라를 바라보면 자동으로 촬영됩니다. 등록이 완료되면 관리자 기능을 사용할 수 있습니다."
          fullHeight={false}
          containerClassName="flex-1"
        />
      </div>
    </div>
  )
}
