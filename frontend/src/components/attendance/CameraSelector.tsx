import { useThemeStore } from '../../stores/theme-store'

interface CameraSelectorProps {
  availableDevices: Array<{ deviceId: string; label: string }>
  selectedDeviceId: string | undefined
  onDeviceChange: (deviceId: string) => void
}

export const CameraSelector = ({
  availableDevices,
  selectedDeviceId,
  onDeviceChange,
}: CameraSelectorProps) => {
  const { isDark } = useThemeStore()

  if (availableDevices.length <= 1) return null

  return (
    <div className="mb-4">
      <label className={`mb-2 block text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-zinc-700'}`}>
        카메라 선택
      </label>
      <select
        value={selectedDeviceId || ''}
        onChange={(e) => onDeviceChange(e.target.value)}
        className={`w-full rounded-xl border px-3 py-2 text-sm ${
          isDark
            ? 'border-slate-700 bg-slate-800 text-white'
            : 'border-zinc-300 bg-white text-zinc-900'
        }`}
      >
        {availableDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </select>
    </div>
  )
}

