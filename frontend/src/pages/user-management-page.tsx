import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { 
  getAdminUsers, 
  deleteUser, 
  resetUserPassword, 
  deleteUserFaceData, 
  type AdminUser 
} from '../api/admin'
import { PageHeader } from '../components/common/page-header'
import { LoadingSpinner } from '../components/common/loading-spinner'
import { UserFilter } from '../components/user/user-filter'
import { UserList } from '../components/user/user-list'

export const UserManagementPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users)
      return
    }
    const query = searchQuery.toLowerCase()
    setFilteredUsers(
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.userId.toLowerCase().includes(query) ||
          user.organizationType.toLowerCase().includes(query)
      )
    )
  }, [searchQuery, users])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const data = await getAdminUsers()
      setUsers(data)
      setFilteredUsers(data)
    } catch (error) {
      toast.error('사용자 목록 로드 실패')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('정말 이 사용자를 삭제하시겠습니까?\n\n주의: 사용자와 연결된 모든 데이터(얼굴 데이터 파일, 출입 기록 등)가 영구적으로 삭제됩니다.')) return

    try {
      await deleteUser(userId)
      toast.success('사용자가 삭제되었습니다')
      loadUsers()
    } catch (error: any) {
      toast.error('사용자 삭제 실패', {
        description: error.response?.data?.detail || '오류가 발생했습니다',
      })
    }
  }

  const handleResetPassword = async (userId: number) => {
    if (!confirm("이 사용자의 비밀번호를 '1234'로 초기화하시겠습니까?")) return

    try {
      await resetUserPassword(userId)
      toast.success('비밀번호가 초기화되었습니다')
    } catch (error: any) {
      toast.error('비밀번호 초기화 실패', {
        description: error.response?.data?.detail || '오류가 발생했습니다',
      })
    }
  }

  const handleDeleteFaceData = async (userId: number) => {
    if (!confirm('정말 이 사용자의 얼굴 데이터를 삭제하시겠습니까?\n\n사용자 계정은 유지되지만 얼굴 인증을 할 수 없게 됩니다.')) return

    try {
      await deleteUserFaceData(userId)
      toast.success('얼굴 데이터가 삭제되었습니다')
      loadUsers() // 상태 업데이트를 위해 목록 다시 로드
    } catch (error: any) {
      toast.error('얼굴 데이터 삭제 실패', {
        description: error.response?.data?.detail || '오류가 발생했습니다',
      })
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader 
        title="사용자 관리" 
        description="전체 사용자 계정 및 권한 관리"
        backButton={{ label: "대시보드로", to: "/admin" }}
      />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">
          <UserFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner fullScreen={false} size={32} />
            </div>
          ) : (
            <UserList 
              users={filteredUsers}
              onResetPassword={handleResetPassword}
              onDeleteFaceData={handleDeleteFaceData}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </div>
      </div>
    </div>
  )
}
