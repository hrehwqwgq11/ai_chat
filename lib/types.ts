export interface Message {
  id: string
  conversationId: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: Date
  metadata?: MessageMetadata
}

export interface MessageMetadata {
  model?: string
  tokens?: number
  error?: string
  regenerated?: boolean
}

export interface Conversation {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messages: Message[]
  model: string
  settings: ConversationSettings
}

export interface ConversationSettings {
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  defaultModel: string
  messageLimit: number
  autoSave: boolean
  keyboardShortcuts: boolean
  sidebarCollapsed: boolean
}

export interface AIModel {
  id: string
  name: string
  description: string
  provider: string
  maxTokens: number
  available: boolean
}

export type Theme = 'light' | 'dark' | 'system'
export type MessageRole = 'user' | 'assistant' | 'system'