import { useCallback, useState } from 'react'
import { toast } from 'sonner'

interface UseFacePreviewProps {
  verifyFn: (image: string) => Promise<{ similarity: number; verified: boolean; detected?: boolean }>
  onSuccess?: (imageSrc: string, similarity: number) => void
}

export const useFacePreview = ({ verifyFn, onSuccess }: UseFacePreviewProps) => {
  const [similarity, setSimilarity] = useState<number | null>(null)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)

  const previewSimilarity = useCallback(async (imageSrc: string) => {
    try {
      setIsPreviewing(true)
      setPreviewError(null)
      const base64Image = imageSrc.split(',')[1]
      
      const response = await verifyFn(base64Image)
      
      const similarityPercent = response.similarity * 100
      setSimilarity(similarityPercent)

      if (response.verified) {
        toast.success('얼굴 인식 성공', {
          description: `유사도 ${similarityPercent.toFixed(1)}%`,
          duration: 1500,
        })
        onSuccess?.(imageSrc, similarityPercent)
      }
      return response
    } catch (error: any) {
      setSimilarity(null)
      setPreviewError(error.response?.data?.detail || '유사도 확인 중 오류가 발생했습니다.')
      throw error
    } finally {
      setIsPreviewing(false)
    }
  }, [verifyFn, onSuccess])

  const resetPreview = useCallback(() => {
    setSimilarity(null)
    setPreviewError(null)
  }, [])

  return {
    similarity,
    isPreviewing,
    previewError,
    previewSimilarity,
    resetPreview,
    setSimilarity, 
    setPreviewError,
  }
}
