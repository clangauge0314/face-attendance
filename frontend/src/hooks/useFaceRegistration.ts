import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { getFaceEmbeddings, registerFaceBase64 } from '../api/face'

export const useFaceRegistration = () => {
  const [hasFaceData, setHasFaceData] = useState<boolean | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const checkFaceData = useCallback(async () => {
    try {
      const embeddings = await getFaceEmbeddings()
      setHasFaceData(embeddings.length > 0)
    } catch (error) {
      console.error('Failed to check face data', error)
      setHasFaceData(false)
    }
  }, [])

  const capture = useCallback((imageSrc: string) => {
    setCapturedImage(imageSrc)
  }, [])

  const retake = useCallback(() => {
    setCapturedImage(null)
  }, [])

  const registerFace = useCallback(async () => {
    if (!capturedImage) return
    setIsRegistering(true)
    try {
      const base64Image = capturedImage.split(',')[1]
      await registerFaceBase64({ image: base64Image })
      toast.success('얼굴 등록 완료', { description: '얼굴 데이터가 성공적으로 등록되었습니다.' })
      setHasFaceData(true)
    } catch (error: any) {
      toast.error('얼굴 등록 실패', { description: error.response?.data?.detail || '얼굴 등록 중 오류가 발생했습니다.' })
      setCapturedImage(null)
    } finally {
      setIsRegistering(false)
    }
  }, [capturedImage])

  return {
    hasFaceData,
    isRegistering,
    capturedImage,
    checkFaceData,
    capture,
    retake,
    registerFace,
  }
}

