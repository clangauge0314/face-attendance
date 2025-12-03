import { useCallback, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { toast } from 'sonner'
import { verifyFacePreview } from '../api/face'

interface UseFaceDetectionProps {
  isOpen: boolean
  capturedImage: string | null
  isChecking: boolean
  webcamRef: React.RefObject<Webcam | null>
  onAutoCapture: (imageSrc: string) => void
}

export const useFaceDetection = ({
  isOpen,
  capturedImage,
  isChecking,
  webcamRef,
  onAutoCapture,
}: UseFaceDetectionProps) => {
  const [similarity, setSimilarity] = useState<number | null>(null)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const detectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDetectingRef = useRef(false)
  const consecutiveDetectionsRef = useRef(0)

  const previewSimilarity = useCallback(async (imageSrc: string) => {
    try {
      setIsPreviewing(true)
      setPreviewError(null)
      const base64Image = imageSrc.split(',')[1]
      const response = await verifyFacePreview({ image: base64Image })
      setSimilarity(response.similarity * 100)
      if (response.verified) {
        toast.success('얼굴 인식 성공', {
          description: `유사도 ${(response.similarity * 100).toFixed(1)}%`,
          duration: 1500,
        })
      }
    } catch (error: any) {
      setSimilarity(null)
      setPreviewError('유사도 확인 중 오류가 발생했습니다.')
    } finally {
      setIsPreviewing(false)
    }
  }, [])

  const detect = useCallback(async () => {
    if (!isOpen || capturedImage || isChecking || !webcamRef.current) {
      if (detectionTimeoutRef.current) clearTimeout(detectionTimeoutRef.current)
      return
    }

    if (isDetectingRef.current) {
      detectionTimeoutRef.current = setTimeout(detect, 200)
      return
    }

    const imageSrc = webcamRef.current.getScreenshot()
    if (!imageSrc) {
      detectionTimeoutRef.current = setTimeout(detect, 200)
      return
    }

    try {
      setIsPreviewing(true)
      isDetectingRef.current = true
      const base64Image = imageSrc.split(',')[1]
      
      const response = await verifyFacePreview({ image: base64Image })
      
      if (response.detected) {
        const similarityPercent = response.similarity * 100
        setSimilarity(similarityPercent)

        if (response.verified && similarityPercent >= 70) {
          consecutiveDetectionsRef.current += 1

          if (consecutiveDetectionsRef.current >= 2) {
            console.log('Auto capturing for check-in...')
            onAutoCapture(imageSrc)
            consecutiveDetectionsRef.current = 0
          }
        } else {
          consecutiveDetectionsRef.current = 0
        }
      } else {
        setSimilarity(null)
        consecutiveDetectionsRef.current = 0
      }
    } catch (error) {
      consecutiveDetectionsRef.current = 0
      setSimilarity(null)
    } finally {
      setIsPreviewing(false)
      isDetectingRef.current = false
      if (isOpen && !capturedImage) {
        detectionTimeoutRef.current = setTimeout(detect, 500)
      }
    }
  }, [isOpen, capturedImage, isChecking, webcamRef, onAutoCapture])

  const resetDetection = useCallback(() => {
    setSimilarity(null)
    setPreviewError(null)
    consecutiveDetectionsRef.current = 0
  }, [])

  useEffect(() => {
    if (isOpen && !capturedImage) {
      detect()
    }
    return () => {
      if (detectionTimeoutRef.current) clearTimeout(detectionTimeoutRef.current)
    }
  }, [detect, isOpen, capturedImage])

  useEffect(() => {
    if (!isOpen) {
      resetDetection()
    }
  }, [isOpen, resetDetection])

  return {
    similarity,
    isPreviewing,
    previewError,
    previewSimilarity,
    resetDetection,
  }
}
