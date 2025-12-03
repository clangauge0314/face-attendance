import { motion } from 'framer-motion'
import { Shield, User, RefreshCw, ScanFace, Trash2 } from 'lucide-react'
import { useThemeStore } from '../../stores/theme-store'
import type { AdminUser } from '../../api/admin'

interface UserListItemProps {
  user: AdminUser
  onResetPassword: (userId: number) => void
  onDeleteFaceData: (userId: number) => void
  onDeleteUser: (userId: number) => void
}

export const UserListItem = ({ 
  user, 
  onResetPassword, 
  onDeleteFaceData, 
  onDeleteUser 
}: UserListItemProps) => {
  const { isDark } = useThemeStore()

  return (
    <motion.div
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
          onClick={() => onResetPassword(user.id)}
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
            onClick={() => onDeleteFaceData(user.id)}
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
          onClick={() => onDeleteUser(user.id)}
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
  )
}

