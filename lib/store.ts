'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Conversation, Message, UserSettings, AIModel } from './types'
import { generateId } from './utils'

interface ChatStore {
  // Conversations
  conversations: Conversation[]
  currentConversationId: string | null
  
  // UI State
  sidebarCollapsed: boolean
  isTyping: boolean
  
  // Settings
  settings: UserSettings
  
  // Models
  availableModels: AIModel[]
  
  // Actions
  createConversation: (title?: string, model?: string) => string
  deleteConversation: (id: string) => void
  updateConversation: (id: string, updates: Partial<Conversation>) => void
  setCurrentConversation: (id: string | null) => void
  
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void
  deleteMessage: (conversationId: string, messageId: string) => void
  
  updateSettings: (updates: Partial<UserSettings>) => void
  toggleSidebar: () => void
  setIsTyping: (typing: boolean) => void
  
  // Getters
  getCurrentConversation: () => Conversation | null
  getConversationById: (id: string) => Conversation | null
}

const defaultSettings: UserSettings = {
  theme: 'system',
  defaultModel: 'meta-llama/llama-3.2-3b-instruct:free',
  messageLimit: 100,
  autoSave: true,
  keyboardShortcuts: true,
  sidebarCollapsed: false,
}

const defaultModels: AIModel[] = [
  {
    id: 'meta-llama/llama-3.2-3b-instruct:free',
    name: 'Llama 3.2 3B',
    description: 'Fast and efficient open-source model (Free)',
    provider: 'Meta',
    maxTokens: 8192,
    available: true,
  },
  {
    id: 'meta-llama/llama-3.2-1b-instruct:free',
    name: 'Llama 3.2 1B',
    description: 'Lightweight model for simple tasks (Free)',
    provider: 'Meta',
    maxTokens: 8192,
    available: true,
  },
  {
    id: 'google/gemma-2-9b-it:free',
    name: 'Gemma 2 9B',
    description: 'Google\'s efficient instruction-tuned model (Free)',
    provider: 'Google',
    maxTokens: 8192,
    available: true,
  },
  {
    id: 'microsoft/phi-3-mini-128k-instruct:free',
    name: 'Phi-3 Mini',
    description: 'Microsoft\'s compact model (Free)',
    provider: 'Microsoft',
    maxTokens: 128000,
    available: true,
  },
  {
    id: 'qwen/qwen-2-7b-instruct:free',
    name: 'Qwen 2 7B',
    description: 'Alibaba\'s multilingual model (Free)',
    provider: 'Alibaba',
    maxTokens: 32768,
    available: true,
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable model, best for complex tasks',
    provider: 'OpenAI',
    maxTokens: 8192,
    available: false,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient for most tasks',
    provider: 'OpenAI',
    maxTokens: 4096,
    available: false,
  },
  {
    id: 'claude-3',
    name: 'Claude 3',
    description: 'Anthropic\'s latest model',
    provider: 'Anthropic',
    maxTokens: 8192,
    available: false,
  },
]

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      sidebarCollapsed: false,
      isTyping: false,
      settings: defaultSettings,
      availableModels: defaultModels,

      createConversation: (title = 'New Chat', model = defaultSettings.defaultModel) => {
        const id = generateId()
        const conversation: Conversation = {
          id,
          title,
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: [],
          model,
          settings: {},
        }
        
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          currentConversationId: id,
        }))
        
        return id
      },

      deleteConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          currentConversationId: state.currentConversationId === id ? null : state.currentConversationId,
        }))
      },

      updateConversation: (id, updates) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
          ),
        }))
      },

      setCurrentConversation: (id) => {
        set({ currentConversationId: id })
      },

      addMessage: (conversationId, message) => {
        const newMessage: Message = {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        }
        
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [...c.messages, newMessage],
                  updatedAt: new Date(),
                  title: c.messages.length === 0 && message.role === 'user' 
                    ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
                    : c.title
                }
              : c
          ),
        }))
      },

      updateMessage: (conversationId, messageId, updates) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === messageId ? { ...m, ...updates } : m
                  ),
                  updatedAt: new Date(),
                }
              : c
          ),
        }))
      },

      deleteMessage: (conversationId, messageId) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: c.messages.filter((m) => m.id !== messageId),
                  updatedAt: new Date(),
                }
              : c
          ),
        }))
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }))
      },

      toggleSidebar: () => {
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        }))
      },

      setIsTyping: (typing) => {
        set({ isTyping: typing })
      },

      getCurrentConversation: () => {
        const state = get()
        return state.currentConversationId
          ? state.conversations.find((c) => c.id === state.currentConversationId) || null
          : null
      },

      getConversationById: (id) => {
        const state = get()
        return state.conversations.find((c) => c.id === id) || null
      },
    }),
    {
      name: 'chat-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        conversations: state.conversations,
        settings: state.settings,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
)