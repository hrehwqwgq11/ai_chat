'use client'

import { Sidebar } from './sidebar'
import { Header } from './header'
import { useChatStore } from '@/lib/store'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { sidebarCollapsed } = useChatStore()

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