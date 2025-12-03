import { useCallback, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'

interface UseFaceDetectionProps {
  isOpen: boolean
  capturedImage: string | null
  isChecking?: boolean // Optional now
  webcamRef: React.RefObject<Webcam | null>
  onAutoCapture: (imageSrc: string) => void
  verifyFn: (image: string) => Promise<{ similarity: number; verified: boolean; detected?: boolean }>
}

export const useFaceDetection = ({
  isOpen,
  capturedImage,
  webcamRef,
  onAutoCapture,
  verifyFn,
}: UseFaceDetectionProps) => {
  const [similarity, setSimilarity] = useState<number | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const detectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDetectingRef = useRef(false)
  const consecutiveDetectionsRef = useRef(0)

  const detect = useCallback(async () => {
    if (!isOpen || capturedImage || !webcamRef.current) {
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
      setIsDetecting(true)
      isDetectingRef.current = true
      const base64Image = imageSrc.split(',')[1]
      
      const response = await verifyFn(base64Image)
      
      // Check if detected is present (some APIs might not return it, assume detected if no error?)
      // But verifyFacePreview returns detected.
      const isDetected = response.detected !== false
      
      if (isDetected) {
        const similarityPercent = response.similarity * 100
        setSimilarity(similarityPercent)

        if (response.verified && similarityPercent >= 70) {
          consecutiveDetectionsRef.current += 1

          if (consecutiveDetectionsRef.current >= 2) {
            console.log('Auto capturing...')
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
      setIsDetecting(false)
      isDetectingRef.current = false
      if (isOpen && !capturedImage) {
        detectionTimeoutRef.current = setTimeout(detect, 500)
      }
    }
  }, [isOpen, capturedImage, webcamRef, onAutoCapture, verifyFn])

  const resetDetection = useCallback(() => {
    setSimilarity(null)
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
    isDetecting,
    resetDetection,
  }
}
