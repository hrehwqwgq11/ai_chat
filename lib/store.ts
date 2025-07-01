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
  defaultModel: 'meta-llama/llama-3.3-70b-instruct:free',
  messageLimit: 100,
  autoSave: true,
  keyboardShortcuts: true,
  sidebarCollapsed: false,
}

const defaultModels: AIModel[] = [
  // Meta Llama Models (Free)
  {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama 3.3 70B',
    description: 'Latest large Llama model with enhanced capabilities (Free)',
    provider: 'Meta',
    maxTokens: 8192,
    available: true,
  },
  {
    id: 'meta-llama/llama-3.3-8b-instruct:free',
    name: 'Llama 3.3 8B',
    description: 'Balanced performance and efficiency (Free)',
    provider: 'Meta',
    maxTokens: 8192,
    available: true,
  },
  {
    id: 'meta-llama/llama-3.2-3b-instruct:free',
    name: 'Llama 3.2 3B',
    description: 'Fast and efficient for most tasks (Free)',
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
    id: 'meta-llama/llama-3.1-8b-instruct:free',
    name: 'Llama 3.1 8B',
    description: 'Proven performance for general tasks (Free)',
    provider: 'Meta',
    maxTokens: 8192,
    available: true,
  },
  {
    id: 'meta-llama/llama-3.2-11b-vision-instruct:free',
    name: 'Llama 3.2 11B Vision',
    description: 'Multimodal model with vision capabilities (Free)',
    provider: 'Meta',
    maxTokens: 8192,
    available: true,
  },
  
  // Google Gemma Models (Free)
  {
    id: 'google/gemma-3-12b-it:free',
    name: 'Gemma 3 12B',
    description: 'Latest Gemma model with improved performance (Free)',
    provider: 'Google',
    maxTokens: 8192,
    available: true,
  },
  {
    id: 'google/gemma-2-9b-it:free',
    name: 'Gemma 2 9B',
    description: 'Efficient instruction-tuned model (Free)',
    provider: 'Google',
    maxTokens: 8192,
    available: true,
  },
  {
    id: 'google/gemma-3-1b-it:free',
    name: 'Gemma 3 1B',
    description: 'Compact model for quick responses (Free)',
    provider: 'Google',
    maxTokens: 8192,
    available: true,
  },

  // Qwen Models (Free)
  {
    id: 'qwen/qwen-2.5-72b-instruct:free',
    name: 'Qwen 2.5 72B',
    description: 'Large multilingual model with strong reasoning (Free)',
    provider: 'Alibaba',
    maxTokens: 32768,
    available: true,
  },
  {
    id: 'qwen/qwen-2.5-7b-instruct:free',
    name: 'Qwen 2.5 7B',
    description: 'Efficient multilingual model (Free)',
    provider: 'Alibaba',
    maxTokens: 32768,
    available: true,
  },
  {
    id: 'qwen/qwq-32b:free',
    name: 'QwQ 32B',
    description: 'Reasoning-focused model (Free)',
    provider: 'Alibaba',
    maxTokens: 32768,
    available: true,
  },

  // Mistral Models (Free)
  {
    id: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B',
    description: 'High-quality open-source model (Free)',
    provider: 'Mistral AI',
    maxTokens: 8192,
    available: true,
  },
  {
    id: 'mistralai/mistral-small-24b-instruct-2501:free',
    name: 'Mistral Small 24B',
    description: 'Latest small Mistral model (Free)',
    provider: 'Mistral AI',
    maxTokens: 8192,
    available: true,
  },

  // DeepSeek Models (Free)
  {
    id: 'deepseek/deepseek-v3:free',
    name: 'DeepSeek V3',
    description: 'Advanced reasoning and coding model (Free)',
    provider: 'DeepSeek',
    maxTokens: 8192,
    available: true,
  },

  // Microsoft Models (Free)
  {
    id: 'microsoft/phi-3-mini-128k-instruct:free',
    name: 'Phi-3 Mini',
    description: 'Compact model with large context (Free)',
    provider: 'Microsoft',
    maxTokens: 128000,
    available: true,
  },

  // Premium Models (Require API Credits)
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
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    description: 'Balanced performance and speed',
    provider: 'Anthropic',
    maxTokens: 200000,
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