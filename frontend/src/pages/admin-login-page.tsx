import { motion } from 'framer-motion'
import { Shield, X } from 'lucide-react'
import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Webcam from 'react-webcam'
import { toast } from 'sonner'
import {
  buttonHover,
  buttonTap,
  containerVariants,
  itemVariants,
  pageVariants,
} from '../constants/animations'
import { getThemeClasses } from '../constants/theme'
import { adminLogin } from '../api/admin'
import { getFaceEmbeddings } from '../api/face'
import { useThemeStore } from '../stores/theme-store'
import { setToken, getToken } from '../utils/local-storage'
import { AdminFaceVerificationModal } from '../components/admin/admin-face-verification-modal'
import { useAuth } from '../hooks/useAuth'

export const AdminLoginPage = () => {
  const { isDark } = useThemeStore()
  const theme = getThemeClasses(isDark)
  const navigate = useNavigate()
  const { loadUser } = useAuth()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showFaceVerification, setShowFaceVerification] = useState(false)
  const [faceImage, setFaceImage] = useState<string | null>(null)
  const webcamRef = useRef<Webcam>(null)

  useEffect(() => {
    const token = getToken()
    if (token) {
      navigate('/admin')
    }
  }, [navigate])

  const openFaceModal = () => {
    if (!userId) {
      toast.error('아이디 입력 필요', {
        description: '얼굴 인증 전에 관리자 아이디를 입력해주세요.',
      })
      return false
    }

    setShowFaceVerification(true)
    return true
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!userId || !password) {
      toast.error('입력 오류', {
        description: '아이디와 비밀번호를 입력해주세요.',
      })
      return
    }

    setIsLoading(true)
    try {
      const payload: { userId: string; password: string; image?: string } = { userId, password }
      if (faceImage) {
        payload.image = faceImage.split(',')[1]
      }

      const response = await adminLogin(payload)

      setToken(response.access_token)
      setFaceImage(null)
      
      // 로그인 상태 동기화
      await loadUser()

      const embeddings = await getFaceEmbeddings()
      const hasRegisteredFace = embeddings.length > 0

      if (!hasRegisteredFace) {
        toast.info('얼굴 데이터 등록 필요', {
          description: '얼굴을 등록한 뒤 관리자 기능을 사용할 수 있습니다.',
        })
        navigate('/admin/face-setup')
      } else {
        toast.success('관리자 로그인 성공', {
          description: '얼굴 인증이 완료되었습니다.',
        })
        navigate('/admin')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || '아이디 또는 비밀번호가 올바르지 않습니다.'

      if (errorMessage.includes('얼굴 인식이 필요')) {
        setFaceImage(null)
        toast.info('얼굴 인증 필요', {
          description: '얼굴을 촬영하여 다시 시도해주세요.',
        })
        openFaceModal()
        return
      }

      if (errorMessage.includes('얼굴 인증에 실패')) {
        setFaceImage(null)
        openFaceModal()
      }

      toast.error('로그인 실패', {
        description: errorMessage,
      })
      setFaceImage(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFaceVerified = (imageSrc: string) => {
    setFaceImage(imageSrc)
    setShowFaceVerification(false)
    setTimeout(() => {
      const form = document.querySelector('form') as HTMLFormElement
      if (form) {
        form.requestSubmit()
      }
    }, 100)
  }

  return (
    <motion.div
      className="flex min-h-[calc(100vh-3rem)] items-center justify-center px-4 py-10 sm:px-6 sm:py-12 lg:py-16"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
    >
      <div className="w-full max-w-lg">
        <motion.div
          className={`relative rounded-3xl border ${theme.card.border} ${theme.card.bg} p-6 shadow-2xl ${theme.card.shadow} backdrop-blur sm:p-8`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <button
            onClick={() => navigate('/')}
            className={`absolute right-4 top-4 rounded-lg p-2 transition-colors ${
              isDark ? 'hover:bg-slate-800' : 'hover:bg-zinc-100'
            }`}
          >
            <X size={20} className={isDark ? 'text-slate-400' : 'text-zinc-600'} />
          </button>

          <motion.div className="mb-8" variants={itemVariants}>
            <div className={`mb-4 flex items-center gap-2.5 ${theme.text.icon}`}>
              <Shield size={18} className="shrink-0 text-red-500" />
              <span className="text-xs font-medium uppercase tracking-[0.5em]">Admin</span>
            </div>
            <h2 className={`mb-3 text-2xl font-semibold leading-tight sm:text-3xl ${theme.text.header}`}>
              관리자 인증
            </h2>
            <p className={`text-sm leading-relaxed ${theme.text.sub}`}>
              관리자 계정으로 로그인하여 시스템을 관리하세요.
            </p>
          </motion.div>

          <motion.form className="mb-6 flex flex-col gap-6" onSubmit={handleLogin} variants={itemVariants}>
            <div className="grid gap-5 sm:grid-cols-2">
              <motion.label className="flex flex-col gap-2.5" variants={itemVariants}>
                <span className={`text-sm font-semibold ${theme.text.label}`}>관리자 아이디</span>
                <input
                  className={`
                    rounded-2xl
                    border ${theme.input.border}
                    ${theme.input.bg}
                    px-3 py-2.5 text-sm outline-none transition-all
                    sm:px-5 sm:py-3.5 sm:text-base
                    ${theme.input.placeholder}
                    ${theme.input.text}
                    ${theme.input.focusBorder}
                    focus:ring-2 ${theme.input.focusRing}
                  `}
                  placeholder="admin"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  disabled={isLoading}
                  required
                  autoFocus
                    />
              </motion.label>
              <motion.label className="flex flex-col gap-2.5" variants={itemVariants}>
                <span className={`text-sm font-semibold ${theme.text.label}`}>접속 비밀번호</span>
                <input
                  className={`
                    rounded-2xl
                    border ${theme.input.border}
                    ${theme.input.bg}
                    px-3 py-2.5 text-sm outline-none transition-all
                    sm:px-5 sm:py-3.5 sm:text-base
                    ${theme.input.placeholder}
                    ${theme.input.text}
                    ${theme.input.focusBorder}
                    focus:ring-2 ${theme.input.focusRing}
                  `}
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </motion.label>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className={`
                mt-2 w-full rounded-2xl py-4 text-base font-semibold transition-all active:scale-[0.98]
                bg-linear-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              whileHover={isLoading ? {} : buttonHover}
              whileTap={isLoading ? {} : buttonTap}
              variants={itemVariants}
            >
              {isLoading ? '처리 중...' : '관리자 로그인'}
            </motion.button>
          </motion.form>
        </motion.div>
      </div>

      <AdminFaceVerificationModal
        isOpen={showFaceVerification}
        onClose={() => {
          setShowFaceVerification(false)
          setFaceImage(null)
        }}
        onVerified={handleFaceVerified}
        webcamRef={webcamRef}
        userId={userId}
      />
    </motion.div>
  )
}
