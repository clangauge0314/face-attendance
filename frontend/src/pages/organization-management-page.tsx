import { motion } from 'framer-motion'
import { Building2, Plus, Trash2, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useThemeStore } from '../stores/theme-store'
import {
  listOrganizations,
  getOrganization,
  createOrganization,
  addMember,
  removeMember,
  type OrganizationResponse,
  type OrganizationDetailResponse,
} from '../api/organization'

export const OrganizationManagementPage = () => {
  const { isDark } = useThemeStore()
  const navigate = useNavigate()
  const [organizations, setOrganizations] = useState<OrganizationResponse[]>([])
  const [selectedOrg, setSelectedOrg] = useState<OrganizationDetailResponse | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)

  const [newOrgName, setNewOrgName] = useState('')
  const [newOrgType, setNewOrgType] = useState('company')
  const [newMemberUserId, setNewMemberUserId] = useState('')

  useEffect(() => {
    loadOrganizations()
  }, [])

  const loadOrganizations = async () => {
    try {
      const data = await listOrganizations()
      setOrganizations(data)
    } catch (error) {
      toast.error('조직 목록 로드 실패')
    }
  }

  const loadOrganizationDetail = async (id: number) => {
    try {
      const data = await getOrganization(id)
      setSelectedOrg(data)
    } catch (error) {
      toast.error('조직 상세 정보 로드 실패')
    }
  }

  const handleCreateOrganization = async () => {
    if (!newOrgName.trim()) {
      toast.error('조직 이름을 입력해주세요')
      return
    }

    try {
      await createOrganization({ name: newOrgName, type: newOrgType })
      toast.success('조직이 생성되었습니다')
      setShowCreateModal(false)
      setNewOrgName('')
      setNewOrgType('company')
      loadOrganizations()
    } catch (error: any) {
      toast.error('조직 생성 실패', {
        description: error.response?.data?.detail || '오류가 발생했습니다',
      })
    }
  }

  const handleAddMember = async () => {
    if (!selectedOrg || !newMemberUserId.trim()) {
      toast.error('사용자 ID를 입력해주세요')
      return
    }

    try {
      await addMember(selectedOrg.id, { userId: newMemberUserId })
      toast.success('멤버가 추가되었습니다')
      setShowAddMemberModal(false)
      setNewMemberUserId('')
      loadOrganizationDetail(selectedOrg.id)
      loadOrganizations()
    } catch (error: any) {
      toast.error('멤버 추가 실패', {
        description: error.response?.data?.detail || '오류가 발생했습니다',
      })
    }
  }

  const handleRemoveMember = async (memberId: number) => {
    if (!selectedOrg) return

    if (!confirm('정말 이 멤버를 제거하시겠습니까?')) return

    try {
      await removeMember(selectedOrg.id, memberId)
      toast.success('멤버가 제거되었습니다')
      loadOrganizationDetail(selectedOrg.id)
      loadOrganizations()
    } catch (error: any) {
      toast.error('멤버 제거 실패')
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className={`border-b px-8 py-6 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white/50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              조직 관리
            </h1>
            <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
              조직을 생성하고 멤버를 관리하세요
            </p>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className={`rounded-xl px-4 py-2 font-semibold transition-colors ${
              isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300'
            }`}
          >
            대시보드로
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className={`w-80 overflow-y-auto border-r p-6 ${isDark ? 'border-slate-800 bg-slate-900/30' : 'border-zinc-200 bg-zinc-50/50'}`}>
          <button
            onClick={() => setShowCreateModal(true)}
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
                onClick={() => loadOrganizationDetail(org.id)}
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

        <div className="flex-1 overflow-y-auto p-8">
          {selectedOrg ? (
            <div className="space-y-6">
              <div className={`rounded-3xl border p-6 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'}`}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    멤버 관리
                  </h2>
                  <button
                    onClick={() => setShowAddMemberModal(true)}
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
                        onClick={() => handleRemoveMember(member.id)}
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
          ) : (
            <div className={`flex h-full items-center justify-center ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
              조직을 선택하거나 새로 생성하세요
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
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
                  onClick={() => setShowCreateModal(false)}
                  className={`flex-1 rounded-xl py-2 font-semibold ${
                    isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300'
                  }`}
                >
                  취소
                </button>
                <button
                  onClick={handleCreateOrganization}
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
      )}

      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddMemberModal(false)} />
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
                  onClick={() => setShowAddMemberModal(false)}
                  className={`flex-1 rounded-xl py-2 font-semibold ${
                    isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300'
                  }`}
                >
                  취소
                </button>
                <button
                  onClick={handleAddMember}
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
      )}
    </div>
  )
}

