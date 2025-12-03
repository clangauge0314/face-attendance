import { motion } from 'framer-motion'
import { useThemeStore } from '../../stores/theme-store'

interface CreateOrganizationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  newOrgName: string
  setNewOrgName: (value: string) => void
  newOrgType: string
  setNewOrgType: (value: string) => void
}

export const CreateOrganizationModal = ({
  isOpen,
  onClose,
  onSubmit,
  newOrgName,
  setNewOrgName,
  newOrgType,
  setNewOrgType
}: CreateOrganizationModalProps) => {
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
          조직 생성
        </h3>
        <div className="space-y-4">
          <div>
            <label className={`mb-2 block text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-zinc-700'}`}>
              조직 이름
            </label>
            <input
              type="text"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              className={`w-full rounded-xl border px-4 py-2 ${
                isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-zinc-300 bg-white text-zinc-900'
              }`}
              placeholder="ABC 회사"
            />
          </div>
          <div>
            <label className={`mb-2 block text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-zinc-700'}`}>
              조직 유형
            </label>
            <select
              value={newOrgType}
              onChange={(e) => setNewOrgType(e.target.value)}
              className={`w-full rounded-xl border px-4 py-2 ${
                isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-zinc-300 bg-white text-zinc-900'
              }`}
            >
              <option value="company">회사</option>
              <option value="school">학교</option>
              <option value="department">부서</option>
              <option value="team">팀</option>
            </select>
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
              생성
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

