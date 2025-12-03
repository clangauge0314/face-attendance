import { useCallback, useEffect, useState } from 'react'

interface MediaDeviceInfo {
  deviceId: string
  label: string
}

export const useWebcam = () => {
  const [webcamError, setWebcamError] = useState<string | null>(null)
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined)
  const [isLoadingDevices, setIsLoadingDevices] = useState(true)

  const loadDevices = useCallback(async () => {
    try {
      setIsLoadingDevices(true)
      setWebcamError(null)

      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${device.deviceId.substring(0, 8)}`,
        }))

      console.log('Available video devices:', videoDevices)
      setAvailableDevices(videoDevices)

      if (videoDevices.length === 0) {
        setWebcamError('카메라를 찾을 수 없습니다.')
        return
      }

      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId)
      }
    } catch (error: any) {
      console.error('Error loading devices:', error)
      setWebcamError(`디바이스 로드 실패: ${error.message}`)
    } finally {
      setIsLoadingDevices(false)
    }
  }, [selectedDeviceId])

  const requestCameraPermission = useCallback(async () => {
    try {
      setWebcamError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(track => track.stop())
      await loadDevices()
    } catch (error: any) {
      console.error('Camera permission error:', error)
      if (error.name === 'NotAllowedError') {
        setWebcamError('카메라 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.')
      } else if (error.name === 'NotFoundError') {
        setWebcamError('카메라를 찾을 수 없습니다.')
      } else if (error.name === 'NotReadableError') {
        setWebcamError('카메라에 접근할 수 없습니다. 다른 애플리케이션에서 사용 중일 수 있습니다.')
      } else {
        setWebcamError(`카메라 오류: ${error.message}`)
      }
    }
  }, [loadDevices])

  useEffect(() => {
    requestCameraPermission()
  }, [requestCameraPermission])

  const handleUserMedia = useCallback(() => {
    console.log('Webcam started successfully')
    setWebcamError(null)
  }, [])

  const handleUserMediaError = useCallback((error: string | DOMException) => {
    console.error('Webcam error:', error)
    if (typeof error === 'string') {
      setWebcamError(error)
    } else if (error instanceof DOMException) {
      if (error.name === 'NotAllowedError') {
        setWebcamError('카메라 권한이 거부되었습니다.')
      } else if (error.name === 'NotFoundError') {
        setWebcamError('카메라를 찾을 수 없습니다.')
      } else if (error.name === 'NotReadableError') {
        setWebcamError('카메라에 접근할 수 없습니다.')
      } else {
        setWebcamError(`카메라 오류: ${error.message}`)
      }
    } else {
      setWebcamError('웹캠 초기화 중 오류가 발생했습니다.')
    }
  }, [])

  return {
    webcamError,
    availableDevices,
    selectedDeviceId,
    isLoadingDevices,
    setSelectedDeviceId,
    handleUserMedia,
    handleUserMediaError,
    requestCameraPermission,
  }
}

