'use client'

import { useEffect } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { useChatStore } from '@/lib/store'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { sidebarCollapsed, settings } = useChatStore()

  useEffect(() => {
    // Apply theme on mount
    const applyTheme = () => {
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else if (settings.theme === 'light') {
        document.documentElement.classList.remove('dark')
      } else {
        // System theme
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }

    applyTheme()

    // Listen for system theme changes
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => applyTheme()
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [settings.theme])

  return (
    <div className="h-screen bg-[var(--bg-page)] overflow-hidden">
      <Sidebar />
      <Header />
      
      <main className={cn(
        "pt-16 h-full transition-all",
        sidebarCollapsed ? "ml-16" : "ml-80"
      )}>
        {children}
      </main>
    </div>
  )
}