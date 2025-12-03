import { motion } from 'framer-motion'
import { Trash2, User, Shield, Search, UserX, RefreshCw, ScanFace } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useThemeStore } from '../stores/theme-store'
import { 
  getAdminUsers, 
  deleteUser, 
  resetUserPassword, 
  deleteUserFaceData, 
  type AdminUser 
} from '../api/admin'

export const UserManagementPage = () => {
  const { isDark } = useThemeStore()
  const navigate = useNavigate()
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
      <div className={`border-b px-8 py-6 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white/50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              사용자 관리
            </h1>
            <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
              전체 사용자 계정 및 권한 관리
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

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">
          <div className={`mb-6 flex items-center rounded-2xl border px-4 py-3 ${
            isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'
          }`}>
            <Search className={isDark ? 'text-slate-400' : 'text-zinc-400'} size={20} />
            <input
              type="text"
              placeholder="이름, 아이디, 소속으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`ml-3 w-full bg-transparent outline-none ${
                isDark ? 'text-white placeholder-slate-500' : 'text-zinc-900 placeholder-zinc-400'
              }`}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className={`animate-spin ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                <User size={32} />
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className={`flex flex-col items-center justify-center py-20 ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
              <UserX size={48} className="mb-4 opacity-50" />
              <p>검색 결과가 없습니다</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center justify-between rounded-2xl border p-6 transition-all ${
                    isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-full ${
                      user.role === 'admin' 
                        ? isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
                        : isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {user.role === 'admin' ? <Shield size={24} /> : <User size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                          {user.name}
                        </h3>
                        <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                          isDark ? 'bg-slate-800 text-slate-300' : 'bg-zinc-100 text-zinc-600'
                        }`}>
                          {user.organizationType === 'company' ? '회사' : 
                           user.organizationType === 'school' ? '학교' : 
                           user.organizationType === 'department' ? '부서' : '기타'}
                        </span>
                        {user.role === 'admin' && (
                          <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                            isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
                          }`}>
                            관리자
                          </span>
                        )}
                      </div>
                      <div className={`mt-1 flex items-center gap-3 text-sm ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
                        <span>아이디: {user.userId}</span>
                        <span className="h-3 w-px bg-current opacity-20" />
                        <span>가입일: {new Date(user.createdAt).toLocaleDateString()}</span>
                        <span className="h-3 w-px bg-current opacity-20" />
                        <span className={`flex items-center gap-1 ${user.faceDataRegistered ? 'text-green-500' : 'text-yellow-500'}`}>
                          <div className={`h-2 w-2 rounded-full ${user.faceDataRegistered ? 'bg-green-500' : 'bg-yellow-500'}`} />
                          {user.faceDataRegistered ? '얼굴 등록됨' : '얼굴 미등록'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResetPassword(user.id)}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                        isDark 
                          ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' 
                          : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                      }`}
                      title="비밀번호 초기화"
                    >
                      <RefreshCw size={16} />
                      <span className="hidden sm:inline">비번 초기화</span>
                    </button>

                    {user.faceDataRegistered && (
                      <button
                        onClick={() => handleDeleteFaceData(user.id)}
                        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                          isDark 
                            ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' 
                            : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                        }`}
                        title="얼굴 데이터만 삭제"
                      >
                        <ScanFace size={16} />
                        <span className="hidden sm:inline">얼굴 삭제</span>
                      </button>
                    )}

                    <div className={`mx-2 h-8 w-px ${isDark ? 'bg-slate-800' : 'bg-zinc-200'}`} />

                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                        isDark 
                          ? 'text-red-400 hover:bg-red-500/10' 
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                      title="사용자 영구 삭제"
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">삭제</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}