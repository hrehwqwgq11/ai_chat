'use client'

import { useState } from 'react'
import { 
  Save, 
  Download, 
  Upload, 
  Trash2, 
  Sun, 
  Moon, 
  Monitor,
  Zap,
  Keyboard,
  Database
} from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { useChatStore } from '@/lib/store'
import { useTheme } from '@/components/providers/theme-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { 
    settings, 
    updateSettings, 
    availableModels,
    conversations,
    deleteConversation
  } = useChatStore()
  
  const { setTheme } = useTheme()

  const [localSettings, setLocalSettings] = useState(settings)
  const [hasChanges, setHasChanges] = useState(false)

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
    
    // Update theme immediately for visual feedback
    if (key === 'theme') {
      setTheme(value as 'light' | 'dark' | 'system')
    }
  }

  const handleSave = () => {
    updateSettings(localSettings)
    setHasChanges(false)
  }

  const handleReset = () => {
    setLocalSettings(settings)
    setHasChanges(false)
  }

  const handleExportData = () => {
    const data = {
      conversations,
      settings,
      exportDate: new Date().toISOString(),
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cursor-chat-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        // Here you would implement the import logic
        console.log('Import data:', data)
        alert('Import functionality would be implemented here')
      } catch (error) {
        alert('Invalid file format')
      }
    }
    reader.readAsText(file)
  }

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to delete all conversations? This action cannot be undone.')) {
      conversations.forEach(conv => deleteConversation(conv.id))
      alert('All data has been cleared')
    }
  }

  return (
    <MainLayout>
      <div className="h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
              <p className="text-[var(--text-secondary)] mt-1">
                Customize your AI chat experience
              </p>
            </div>
            
            {hasChanges && (
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleReset}>
                  Reset
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--text-primary)] mb-3 block">
                  Theme
                </label>
                <div className="flex gap-2">
                  {[
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'system', label: 'System', icon: Monitor },
                    { value: 'dark', label: 'Dark', icon: Moon },
                  ].map(({ value, label, icon: Icon }) => (
                    <Button
                      key={value}
                      variant={localSettings.theme === value ? 'primary' : 'secondary'}
                      onClick={() => handleSettingChange('theme', value)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--text-primary)] mb-3 block">
                  Sidebar
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!localSettings.sidebarCollapsed}
                    onChange={(e) => handleSettingChange('sidebarCollapsed', !e.target.checked)}
                    className="rounded border-[var(--border-default)]"
                  />
                  <span className="text-sm text-[var(--text-secondary)]">
                    Show sidebar by default
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Models */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Models
              </CardTitle>
              <CardDescription>
                Configure your preferred AI model and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--text-primary)] mb-3 block">
                  Default Model
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableModels.map((model) => (
                    <div
                      key={model.id}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-all",
                        localSettings.defaultModel === model.id
                          ? "border-[var(--border-focus)] bg-[var(--bg-section)]"
                          : "border-[var(--border-default)] hover:border-[var(--border-light)]"
                      )}
                      onClick={() => handleSettingChange('defaultModel', model.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-[var(--text-primary)]">
                            {model.name}
                          </h4>
                          <p className="text-sm text-[var(--text-secondary)] mt-1">
                            {model.description}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] mt-2">
                            {model.provider} • {model.maxTokens.toLocaleString()} tokens
                          </p>
                        </div>
                        {!model.available && (
                          <span className="text-xs bg-[var(--bg-section)] text-[var(--text-muted)] px-2 py-1 rounded">
                            Soon
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">
                  Message Limit
                </label>
                <Input
                  type="number"
                  value={localSettings.messageLimit}
                  onChange={(e) => handleSettingChange('messageLimit', parseInt(e.target.value))}
                  min="10"
                  max="1000"
                  className="w-32"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Maximum messages per conversation
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Chat Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Chat Preferences
              </CardTitle>
              <CardDescription>
                Configure how the chat interface behaves
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Auto-save conversations
                  </label>
                  <p className="text-xs text-[var(--text-muted)]">
                    Automatically save conversations as you chat
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.autoSave}
                  onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                  className="rounded border-[var(--border-default)]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Keyboard shortcuts
                  </label>
                  <p className="text-xs text-[var(--text-muted)]">
                    Enable keyboard shortcuts for faster navigation
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.keyboardShortcuts}
                  onChange={(e) => handleSettingChange('keyboardShortcuts', e.target.checked)}
                  className="rounded border-[var(--border-default)]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Export, import, or clear your chat data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleExportData} variant="secondary">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                
                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                    id="import-file"
                  />
                  <Button 
                    variant="secondary"
                    onClick={() => document.getElementById('import-file')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-light)]">
                <Button 
                  variant="destructive"
                  onClick={handleClearAllData}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  This will permanently delete all conversations and cannot be undone
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Storage Info */}
          <Card>
            <CardHeader>
              <CardTitle>Storage Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[var(--text-secondary)]">Conversations:</span>
                  <span className="ml-2 font-medium text-[var(--text-primary)]">
                    {conversations.length}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">Total Messages:</span>
                  <span className="ml-2 font-medium text-[var(--text-primary)]">
                    {conversations.reduce((total, conv) => total + conv.messages.length, 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}