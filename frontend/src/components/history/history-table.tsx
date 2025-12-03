import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { useThemeStore } from '../../stores/theme-store'
import { AdminAttendanceRecord } from '../../api/admin'

interface HistoryTableProps {
  records: AdminAttendanceRecord[]
}

export const HistoryTable = ({ records }: HistoryTableProps) => {
  const { isDark } = useThemeStore()

  return (
    <div className={`overflow-hidden rounded-3xl border ${
      isDark ? 'border-slate-800 bg-slate-900/50' : 'border-zinc-200 bg-white'
    }`}>
      <table className="w-full text-left">
        <thead className={`border-b ${isDark ? 'border-slate-800 bg-slate-800/50' : 'border-zinc-200 bg-zinc-50'}`}>
          <tr>
            <th className={`p-4 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>사용자</th>
            <th className={`p-4 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>소속</th>
            <th className={`p-4 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>출입 시간</th>
            <th className={`p-4 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>인증 결과</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-zinc-200'}`}>
          {records.map((record) => (
            <motion.tr
              key={record.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`transition-colors ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-zinc-50'}`}
            >
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isDark ? 'bg-slate-800 text-slate-400' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                  <div>
                    <div className={`font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                      {record.userName}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-zinc-500'}`}>
                      @{record.userUserId}
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-4">
                {record.organizationName ? (
                  <span className={`rounded-md px-2 py-1 text-xs font-medium ${
                    isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {record.organizationName}
                  </span>
                ) : (
                  <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-zinc-400'}`}>-</span>
                )}
              </td>
              <td className={`p-4 text-sm ${isDark ? 'text-slate-300' : 'text-zinc-700'}`}>
                {new Date(record.checkInTime).toLocaleString('ko-KR', {
                  year: 'numeric', 
                  month: '2-digit', 
                  day: '2-digit', 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'
                  }`}>
                    성공
                  </div>
                  <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-zinc-400'}`}>
                    ({record.similarity ? (parseFloat(record.similarity) * 100).toFixed(1) : '0.0'}%)
                  </span>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

