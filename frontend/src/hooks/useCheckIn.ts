import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { checkIn } from '../api/attendance'

interface UseCheckInProps {
  onSuccess: () => void
  onClose: () => void
}

export const useCheckIn = ({ onSuccess, onClose }: UseCheckInProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const handleCheckIn = useCallback(async () => {
    if (!capturedImage) return

    setIsChecking(true)
    try {
      const base64Image = capturedImage.split(',')[1]
      await checkIn({ image: base64Image })
      toast.success('출입 기록 완료', { description: '얼굴 인증이 성공적으로 완료되었습니다.' })
      onSuccess()
      onClose()
      setCapturedImage(null)
    } catch (error: any) {
      toast.error('출입 기록 실패', {
        description: error.response?.data?.detail || '얼굴 인증에 실패했습니다.',
      })
      setCapturedImage(null)
    } finally {
      setIsChecking(false)
    }
  }, [capturedImage, onSuccess, onClose])

  const handleCapture = useCallback((imageSrc: string) => {
    setCapturedImage(imageSrc)
  }, [])

  const handleRetake = useCallback(() => {
    setCapturedImage(null)
  }, [])

  const handleAutoCapture = useCallback((imageSrc: string) => {
    setCapturedImage(imageSrc)
    toast.success('얼굴이 감지되어 촬영되었습니다.', { duration: 2000 })
  }, [])

  const resetCapture = useCallback(() => {
    setCapturedImage(null)
  }, [])

  return {
    capturedImage,
    isChecking,
    handleCheckIn,
    handleCapture,
    handleRetake,
    handleAutoCapture,
    resetCapture,
  }
}

