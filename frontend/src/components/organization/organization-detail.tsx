import { Trash2, UserPlus } from 'lucide-react'
import { useThemeStore } from '../../stores/theme-store'
import type { OrganizationDetailResponse } from '../../api/organization'

interface OrganizationDetailProps {
  selectedOrg: OrganizationDetailResponse | null
  onOpenAddMemberModal: () => void
  onRemoveMember: (memberId: number) => void
}

export const OrganizationDetail = ({
  selectedOrg,
  onOpenAddMemberModal,
  onRemoveMember
}: OrganizationDetailProps) => {
  const { isDark } = useThemeStore()

  if (!selectedOrg) {
    return (
      <div className={`flex h-full items-center justify-center ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
        조직을 선택하거나 새로 생성하세요
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className={`rounded-3xl border p-6 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'}`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            멤버 관리
          </h2>
          <button
            onClick={onOpenAddMemberModal}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              isDark ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <UserPlus size={16} />
              <span>멤버 추가</span>
            </div>
          </button>
        </div>

        <div className="space-y-2">
          {selectedOrg.members.map((member) => (
            <div
              key={member.id}
              className={`flex items-center justify-between rounded-xl border p-4 ${
                isDark ? 'border-slate-800 bg-slate-800/30' : 'border-zinc-200 bg-zinc-50'
              }`}
            >
              <div>
                <div className={`font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {member.userName}
                </div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
                  @{member.userUserId}
                </div>
              </div>
              <button
                onClick={() => onRemoveMember(member.id)}
                className={`rounded-lg p-2 transition-colors ${
                  isDark ? 'text-red-400 hover:bg-red-600/20' : 'text-red-600 hover:bg-red-50'
                }`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

