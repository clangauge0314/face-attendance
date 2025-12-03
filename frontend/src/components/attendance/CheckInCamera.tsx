import Webcam from 'react-webcam'

interface CheckInCameraProps {
  webcamRef: React.RefObject<Webcam | null>
  capturedImage: string | null
  selectedDeviceId: string | undefined
  onUserMedia: () => void
  onUserMediaError: (error: string | DOMException) => void
}

export const CheckInCamera = ({
  webcamRef,
  capturedImage,
  selectedDeviceId,
  onUserMedia,
  onUserMediaError,
}: CheckInCameraProps) => {
  return (
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
          onUserMedia={onUserMedia}
          onUserMediaError={onUserMediaError}
        />
      ) : (
        <img src={capturedImage} alt="Captured" className="h-full w-full object-cover" />
      )}
    </div>
  )
}

