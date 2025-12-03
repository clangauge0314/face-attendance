import { motion } from 'framer-motion'
import { Lock, UserPlus } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  buttonHover,
  buttonTap,
  containerVariants,
  itemVariants,
  pageVariants,
} from '../constants/animations'
import { getThemeClasses } from '../constants/theme'
import { useThemeStore } from '../stores/theme-store'
import { useAuth } from '../hooks/useAuth'

const LoginPage = () => {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { isDark } = useThemeStore()
  const theme = getThemeClasses(isDark)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      await login({ userId, password })
      toast.success('로그인 성공', {
        description: '환영합니다!',
      })
      navigate('/')
    } catch (err: any) {
      toast.error('로그인 실패', {
        description: err.message || '아이디 또는 비밀번호가 올바르지 않습니다.',
      })
    } finally {
      setIsLoading(false)
    }
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
          className={`rounded-3xl border ${theme.card.border} ${theme.card.bg} p-6 shadow-2xl ${theme.card.shadow} backdrop-blur sm:p-8`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="mb-8" variants={itemVariants}>
            <div className={`mb-4 flex items-center gap-2.5 ${theme.text.icon}`}>
              <Lock size={18} className="shrink-0" />
              <span className="text-xs font-medium uppercase tracking-[0.5em]">Sign In</span>
            </div>
            <h2 className={`mb-3 text-2xl font-semibold leading-tight sm:text-3xl ${theme.text.header}`}>
              보안 출입 인증
            </h2>
            <p className={`text-sm leading-relaxed ${theme.text.sub}`}>
              등록된 얼굴 데이터와 계정을 기반으로 출입 로그를 자동으로 동기화합니다.
            </p>
          </motion.div>

          <motion.form className="mb-6 flex flex-col gap-6" onSubmit={handleSubmit} variants={itemVariants}>
            <div className="grid gap-5 sm:grid-cols-2">
              <motion.label className="flex flex-col gap-2.5" variants={itemVariants}>
                <span className={`text-sm font-semibold ${theme.text.label}`}>사용자 아이디</span>
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
                  placeholder="user123"
                  type="text"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  disabled={isLoading}
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
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isLoading}
                />
              </motion.label>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className={`
                mt-2 w-full rounded-2xl py-4 text-base font-semibold transition-all active:scale-[0.98]
                ${theme.button.primary}
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              whileHover={isLoading ? {} : buttonHover}
              whileTap={isLoading ? {} : buttonTap}
              variants={itemVariants}
            >
              {isLoading ? '처리 중...' : '출입 인증'}
            </motion.button>
          </motion.form>

          <motion.div className="mt-4" variants={itemVariants}>
            <Link to="/signup">
              <motion.button
                className={`
                  w-full rounded-xl border ${theme.card.border} px-5 py-3 text-sm font-medium transition-all
                  ${isDark ? 'text-slate-200 hover:bg-white/5' : 'text-zinc-600 hover:bg-zinc-50'}
                `}
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                <div className="flex items-center justify-center gap-2">
                  <UserPlus size={16} />
                  <span>회원가입</span>
                </div>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default LoginPage

