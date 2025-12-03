import { motion } from 'framer-motion'
import { useThemeStore } from '../../stores/theme-store'

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  newMemberUserId: string
  setNewMemberUserId: (value: string) => void
}

export const AddMemberModal = ({
  isOpen,
  onClose,
  onSubmit,
  newMemberUserId,
  setNewMemberUserId
}: AddMemberModalProps) => {
  const { isDark } = useThemeStore()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative z-10 w-full max-w-md rounded-3xl border p-6 ${
          isDark ? 'border-slate-800 bg-slate-900' : 'border-zinc-200 bg-white'
        }`}
      >
        <h3 className={`mb-4 text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          멤버 추가
        </h3>
        <div className="space-y-4">
          <div>
            <label className={`mb-2 block text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-zinc-700'}`}>
              사용자 ID
            </label>
            <input
              type="text"
              value={newMemberUserId}
              onChange={(e) => setNewMemberUserId(e.target.value)}
              className={`w-full rounded-xl border px-4 py-2 ${
                isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-zinc-300 bg-white text-zinc-900'
              }`}
              placeholder="user123"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className={`flex-1 rounded-xl py-2 font-semibold ${
                isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300'
              }`}
            >
              취소
            </button>
            <button
              onClick={onSubmit}
              className={`flex-1 rounded-xl py-2 font-semibold ${
                isDark ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              추가
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

