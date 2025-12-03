import { UserX } from 'lucide-react'
import type { AdminUser } from '../../api/admin'
import { UserListItem } from './user-list-item'
import { EmptyState } from '../common/empty-state'

interface UserListProps {
  users: AdminUser[]
  onResetPassword: (userId: number) => void
  onDeleteFaceData: (userId: number) => void
  onDeleteUser: (userId: number) => void
}

export const UserList = ({ 
  users, 
  onResetPassword, 
  onDeleteFaceData, 
  onDeleteUser 
}: UserListProps) => {
  if (users.length === 0) {
    return <EmptyState icon={UserX} message="검색 결과가 없습니다" />
  }

  return (
    <div className="grid gap-4">
      {users.map((user) => (
        <UserListItem
          key={user.id}
          user={user}
          onResetPassword={onResetPassword}
          onDeleteFaceData={onDeleteFaceData}
          onDeleteUser={onDeleteUser}
        />
      ))}
    </div>
  )
}

