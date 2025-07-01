'use client'

import { useState } from 'react'
import { 
  Menu, 
  Sun, 
  Moon, 
  Monitor, 
  ChevronDown,
  Zap,
  Settings as SettingsIcon
} from 'lucide-react'
import { useChatStore } from '@/lib/store'
import { useTheme } from '@/components/providers/theme-provider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Header() {
  const [showModelSelector, setShowModelSelector] = useState(false)
  const { theme, setTheme } = useTheme()
  
  const {
    getCurrentConversation,
    updateConversation,
    sidebarCollapsed,
    toggleSidebar,
    settings,
    updateSettings,
    availableModels,
  } = useChatStore()

  const currentConversation = getCurrentConversation()

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
  }

  const handleModelChange = (modelId: string) => {
    if (currentConversation) {
      updateConversation(currentConversation.id, { model: modelId })
    }
    updateSettings({ defaultModel: modelId })
    setShowModelSelector(false)
  }

  const currentModel = availableModels.find(
    m => m.id === (currentConversation?.model || settings.defaultModel)
  )



  return (
    <header className={cn(
      "fixed top-0 right-0 z-30 h-16 bg-[var(--bg-card)] border-b border-[var(--border-light)] flex items-center justify-between px-6 transition-all",
      sidebarCollapsed ? "left-16" : "left-80"
    )}>
      {/* Left side */}
      <div className="flex items-center space-x-4">
        {sidebarCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">
            {currentConversation?.title || 'New Chat'}
          </h1>
          {currentConversation && (
            <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-section)] px-2 py-1 rounded">
              {currentConversation.messages.length} messages
            </span>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-2">
        {/* Model Selector */}
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => setShowModelSelector(!showModelSelector)}
            className="flex items-center space-x-2"
          >
            <Zap className="h-4 w-4" />
            <span className="text-sm">{currentModel?.name || 'GPT-4'}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
          
          {showModelSelector && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl shadow-[var(--shadow-card)] py-2 z-50 backdrop-blur-sm">
              {availableModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelChange(model.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 hover:bg-[var(--bg-card-hover)] transition-all duration-200 rounded-lg mx-2",
                    model.id === currentModel?.id && "bg-[var(--bg-card-hover)] border-l-2 border-[var(--border-focus)]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {model.name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {model.description}
                      </p>
                    </div>
                    {!model.available && (
                      <span className="text-xs text-[var(--text-subtle)] bg-[var(--border-default)] px-2 py-1 rounded-md">
                        Soon
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center bg-[var(--bg-section)] rounded-xl p-1 border border-[var(--border-light)]">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleThemeChange('light')}
            className={cn(
              "h-8 w-8 rounded-lg transition-all duration-200",
              theme === 'light' && "bg-[var(--bg-card)] shadow-[var(--shadow-button)] text-[var(--text-primary)]"
            )}
          >
            <Sun className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleThemeChange('system')}
            className={cn(
              "h-8 w-8 rounded-lg transition-all duration-200",
              theme === 'system' && "bg-[var(--bg-card)] shadow-[var(--shadow-button)] text-[var(--text-primary)]"
            )}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleThemeChange('dark')}
            className={cn(
              "h-8 w-8 rounded-lg transition-all duration-200",
              theme === 'dark' && "bg-[var(--bg-card)] shadow-[var(--shadow-button)] text-[var(--text-primary)]"
            )}
          >
            <Moon className="h-4 w-4" />
          </Button>
        </div>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.location.href = '/settings'}
        >
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Click outside to close model selector */}
      {showModelSelector && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowModelSelector(false)}
        />
      )}
    </header>
  )
}