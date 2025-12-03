export const getThemeClasses = (isDark: boolean) => {
  return {
    card: {
      border: isDark ? 'border-slate-500/40' : 'border-zinc-300',
      bg: isDark ? 'bg-[#0d1426]/90' : 'bg-white/95',
      shadow: isDark ? 'shadow-black/40' : 'shadow-zinc-900/5',
    },
    text: {
      header: isDark ? 'text-white' : 'text-zinc-900',
      sub: isDark ? 'text-slate-300' : 'text-zinc-500',
      label: isDark ? 'text-slate-100' : 'text-zinc-700',
      icon: isDark ? 'text-slate-200' : 'text-zinc-500',
      caution: isDark ? 'text-slate-300' : 'text-zinc-500',
      tag: isDark ? 'text-slate-400' : 'text-zinc-500',
    },
    input: {
      border: isDark ? 'border-slate-500/40' : 'border-zinc-300',
      bg: isDark ? 'bg-[#080c17]/80' : 'bg-white/70',
      text: isDark ? 'text-white' : 'text-zinc-900',
      placeholder: isDark ? 'placeholder:text-slate-500' : 'placeholder:text-zinc-400',
      focusBorder: isDark ? 'focus:border-slate-400' : 'focus:border-zinc-500',
      focusRing: isDark ? 'focus:ring-slate-400/30' : 'focus:ring-zinc-500/20',
      full: isDark
        ? 'rounded-2xl border border-slate-500/40 bg-[#0b1120]/70 px-5 py-3.5 text-base outline-none transition-all placeholder:text-slate-500 text-white focus:border-slate-400 focus:ring-2 focus:ring-slate-400/30'
        : 'rounded-2xl border border-zinc-300 bg-white/70 px-5 py-3.5 text-base outline-none transition-all placeholder:text-zinc-400 text-zinc-900 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20',
    },
    button: {
      primary: isDark
        ? 'border border-slate-400/30 bg-linear-to-r from-white via-slate-100 to-white text-[#050a18] shadow-white/10 hover:shadow-white/30'
        : 'border border-zinc-700 bg-zinc-900 text-white shadow-zinc-900/20 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/30',
      primaryFull: isDark
        ? 'mt-2 rounded-2xl border border-slate-400/30 bg-white py-4 text-base font-semibold text-[#060c1d] shadow-lg shadow-white/10 transition-all hover:shadow-xl hover:shadow-white/30 active:scale-[0.98]'
        : 'mt-2 rounded-2xl border border-zinc-700 bg-zinc-900 py-4 text-base font-semibold text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/30 active:scale-[0.98]',
    },
    info: {
      border: isDark ? 'border-slate-500/40' : 'border-zinc-300',
      bg: isDark ? 'bg-white/5 text-slate-200' : 'bg-zinc-50/80 text-zinc-600',
    },
    section: {
      card: isDark
        ? 'rounded-3xl border border-slate-500/40 bg-zinc-900/80 p-8 shadow-xl backdrop-blur'
        : 'rounded-3xl border border-zinc-300 bg-white/90 p-8 shadow-xl backdrop-blur',
    },
  }
}

