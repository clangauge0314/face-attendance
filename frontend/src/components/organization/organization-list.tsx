import { motion } from 'framer-motion'
import { Building2, Plus } from 'lucide-react'
import { useThemeStore } from '../../stores/theme-store'
import type { OrganizationResponse, OrganizationDetailResponse } from '../../api/organization'

interface OrganizationListProps {
  organizations: OrganizationResponse[]
  selectedOrg: OrganizationDetailResponse | null
  onSelect: (id: number) => void
  onOpenCreateModal: () => void
}

export const OrganizationList = ({
  organizations,
  selectedOrg,
  onSelect,
  onOpenCreateModal
}: OrganizationListProps) => {
  const { isDark } = useThemeStore()

  return (
    <div className={`w-80 overflow-y-auto border-r p-6 ${isDark ? 'border-slate-800 bg-slate-900/30' : 'border-zinc-200 bg-zinc-50/50'}`}>
      <button
        onClick={onOpenCreateModal}
        className={`mb-4 w-full rounded-xl py-3 font-semibold transition-colors ${
          isDark ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <Plus size={20} />
          <span>조직 생성</span>
        </div>
      </button>

      <div className="space-y-2">
        {organizations.map((org) => (
          <motion.button
            key={org.id}
            onClick={() => onSelect(org.id)}
            className={`w-full rounded-xl border p-4 text-left transition-all ${
              selectedOrg?.id === org.id
                ? isDark
                  ? 'border-blue-500 bg-blue-600/20'
                  : 'border-blue-500 bg-blue-50'
                : isDark
                ? 'border-slate-800 bg-slate-800/30 hover:bg-slate-800/50'
                : 'border-zinc-200 bg-white hover:bg-zinc-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Building2 size={20} className={selectedOrg?.id === org.id ? 'text-blue-500' : isDark ? 'text-slate-400' : 'text-zinc-500'} />
              <div className="flex-1">
                <div className={`font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {org.name}
                </div>
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
                  {org.type} · {org.memberCount}명
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

