'use client'

import { useEffect, useRef, useState } from 'react'
import { useChatStore } from '@/lib/store'
import { streamChatResponse } from '@/lib/api'
import { Message } from './message'
import { MessageInput } from './message-input'
import { Button } from '@/components/ui/button'
import { MessageSquare, Sparkles } from 'lucide-react'

export function ChatInterface() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const {
    getCurrentConversation,
    currentConversationId,
    createConversation,
    setCurrentConversation,
    addMessage,
    updateMessage,
    deleteMessage,
    setIsTyping,
  } = useChatStore()

  const currentConversation = getCurrentConversation()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentConversation?.messages, streamingContent])

  const handleSendMessage = async (content: string) => {
    let conversationId = currentConversationId

    // Create new conversation if none exists
    if (!conversationId) {
      conversationId = createConversation()
      setCurrentConversation(conversationId)
    }

    // Add user message
    addMessage(conversationId, {
      conversationId,
      content,
      role: 'user',
    })

    // Start generating response
    setIsGenerating(true)
    setIsTyping(true)
    setStreamingContent('')

    try {
      // Create abort controller for this request
      abortControllerRef.current = new AbortController()

      const conversation = getCurrentConversation()
      if (!conversation) return

      // Get all messages including the new user message
      const allMessages = [...conversation.messages, {
        id: 'temp',
        conversationId,
        content,
        role: 'user' as const,
        timestamp: new Date(),
      }]

      // Add placeholder assistant message
      const assistantMessageId = Date.now().toString()
      addMessage(conversationId, {
        conversationId,
        content: '',
        role: 'assistant',
      })

      // Stream the response
      const stream = streamChatResponse(allMessages, conversation.model)
      let fullContent = ''

      for await (const chunk of stream) {
        if (abortControllerRef.current?.signal.aborted) {
          break
        }
        
        fullContent = chunk
        setStreamingContent(chunk)
        
        // Update the assistant message with current content
        updateMessage(conversationId, assistantMessageId, {
          content: chunk,
          metadata: {
            model: conversation.model,
          },
        })
      }

      setStreamingContent('')
    } catch (error) {
      console.error('Error generating response:', error)
      
      // Add error message
      addMessage(conversationId, {
        conversationId,
        content: 'Sorry, I encountered an error while generating a response. Please try again.',
        role: 'assistant',
        metadata: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      })
    } finally {
      setIsGenerating(false)
      setIsTyping(false)
      abortControllerRef.current = null
    }
  }

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsGenerating(false)
      setIsTyping(false)
      setStreamingContent('')
    }
  }

  const handleCopyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
    } catch (error) {
      console.error('Failed to copy message:', error)
    }
  }

  const handleRegenerateMessage = async (messageId: string) => {
    if (!currentConversation) return

    // Find the message and get all messages before it
    const messageIndex = currentConversation.messages.findIndex(m => m.id === messageId)
    if (messageIndex === -1) return

    const messagesBeforeRegenerate = currentConversation.messages.slice(0, messageIndex)
    
    // Remove the message to regenerate and any messages after it
    currentConversation.messages.slice(messageIndex).forEach(msg => {
      deleteMessage(currentConversation.id, msg.id)
    })

    // Regenerate from the last user message
    const lastUserMessage = messagesBeforeRegenerate
      .slice()
      .reverse()
      .find(m => m.role === 'user')

    if (lastUserMessage) {
      await handleSendMessage(lastUserMessage.content)
    }
  }

  const handleDeleteMessage = (messageId: string) => {
    if (currentConversation) {
      deleteMessage(currentConversation.id, messageId)
    }
  }

  const handleStartNewChat = () => {
    const id = createConversation()
    setCurrentConversation(id)
  }

  // Empty state
  if (!currentConversation || currentConversation.messages.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Welcome to Cursor AI
            </h2>
            
            <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
              I'm your AI assistant, ready to help with questions, creative tasks, 
              coding, analysis, and more. What would you like to explore today?
            </p>

            <div className="grid grid-cols-1 gap-3 mb-8">
              {[
                "Explain a complex concept",
                "Help with coding problems",
                "Creative writing assistance",
                "Data analysis and insights"
              ].map((suggestion, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  onClick={() => handleSendMessage(suggestion)}
                  className="text-left justify-start h-auto p-4"
                >
                  <MessageSquare className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>{suggestion}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <MessageInput
          onSendMessage={handleSendMessage}
          onStopGeneration={handleStopGeneration}
          isGenerating={isGenerating}
          placeholder="Ask me anything..."
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {currentConversation.messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              onCopy={handleCopyMessage}
              onRegenerate={handleRegenerateMessage}
              onDelete={handleDeleteMessage}
            />
          ))}
          
          {/* Streaming message */}
          {isGenerating && streamingContent && (
            <div className="group relative flex gap-4 p-6">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    Assistant
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    Generating...
                  </span>
                </div>
                <div className="prose prose-sm max-w-none text-[var(--text-primary)]">
                  {streamingContent.split('\n').map((line, index) => (
                    line.trim() ? (
                      <p key={index} className="mb-2 leading-relaxed">
                        {line}
                      </p>
                    ) : (
                      <br key={index} />
                    )
                  ))}
                  <span className="inline-block w-2 h-4 bg-[var(--text-primary)] animate-pulse ml-1" />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onStopGeneration={handleStopGeneration}
        isGenerating={isGenerating}
      />
    </div>
  )
}