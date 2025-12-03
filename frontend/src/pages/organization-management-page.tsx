import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  listOrganizations,
  getOrganization,
  createOrganization,
  addMember,
  removeMember,
  type OrganizationResponse,
  type OrganizationDetailResponse,
} from '../api/organization'
import { PageHeader } from '../components/common/page-header'
import { CreateOrganizationModal } from '../components/organization/create-organization-modal'
import { AddMemberModal } from '../components/organization/add-member-modal'
import { OrganizationList } from '../components/organization/organization-list'
import { OrganizationDetail } from '../components/organization/organization-detail'

export const OrganizationManagementPage = () => {
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
      <PageHeader
        title="조직 관리"
        description="조직을 생성하고 멤버를 관리하세요"
        backButton={{ label: "대시보드로", to: "/admin" }}
      />

      <div className="flex flex-1 overflow-hidden">
        <OrganizationList
          organizations={organizations}
          selectedOrg={selectedOrg}
          onSelect={loadOrganizationDetail}
          onOpenCreateModal={() => setShowCreateModal(true)}
        />

        <div className="flex-1 overflow-y-auto p-8">
          <OrganizationDetail
            selectedOrg={selectedOrg}
            onOpenAddMemberModal={() => setShowAddMemberModal(true)}
            onRemoveMember={handleRemoveMember}
          />
        </div>
      </div>

      <CreateOrganizationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateOrganization}
        newOrgName={newOrgName}
        setNewOrgName={setNewOrgName}
        newOrgType={newOrgType}
        setNewOrgType={setNewOrgType}
      />

      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onSubmit={handleAddMember}
        newMemberUserId={newMemberUserId}
        setNewMemberUserId={setNewMemberUserId}
      />
    </div>
  )
}
