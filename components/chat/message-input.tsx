'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface MessageInputProps {
  onSendMessage: (content: string) => void
  onStopGeneration?: () => void
  disabled?: boolean
  isGenerating?: boolean
  placeholder?: string
}

export function MessageInput({ 
  onSendMessage, 
  onStopGeneration,
  disabled = false,
  isGenerating = false,
  placeholder = "Type your message..." 
}: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled && !isGenerating) {
      onSendMessage(message.trim())
      setMessage('')
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
  }

  const handleStop = () => {
    if (onStopGeneration) {
      onStopGeneration()
    }
  }

  useEffect(() => {
    // Focus textarea when not generating
    if (!isGenerating && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isGenerating])

  const canSend = message.trim() && !disabled && !isGenerating

  return (
    <div className="border-t border-[var(--border-light)] bg-[var(--bg-card)] p-6">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-4 bg-[var(--bg-section)] rounded-2xl p-4 border border-[var(--border-light)] shadow-[var(--shadow-card)]">
          {/* File attachment button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mb-1 flex-shrink-0 rounded-xl hover:bg-[var(--bg-card-hover)]"
            disabled={disabled}
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          {/* Message input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "min-h-[48px] max-h-[200px] resize-none pr-16 py-3 px-4 bg-transparent border-none",
                "focus:ring-0 focus:border-transparent text-[var(--text-primary)] placeholder:text-[var(--text-subtle)]",
                "text-base leading-relaxed"
              )}
              rows={1}
            />
            
            {/* Character count */}
            {message.length > 0 && (
              <div className="absolute bottom-3 right-16 text-xs text-[var(--text-subtle)] bg-[var(--bg-card)] px-2 py-1 rounded-md">
                {message.length}
              </div>
            )}
          </div>

          {/* Send/Stop button */}
          {isGenerating ? (
            <Button
              type="button"
              onClick={handleStop}
              variant="secondary"
              size="icon"
              className="mb-1 flex-shrink-0 rounded-xl w-12 h-12 border border-[var(--border-default)]"
            >
              <Square className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!canSend}
              variant={canSend ? "primary" : "secondary"}
              size="icon"
              className="mb-1 flex-shrink-0 rounded-xl w-12 h-12 shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-button-hover)]"
            >
              <Send className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Hints */}
        <div className="flex items-center justify-between mt-3 text-sm text-[var(--text-subtle)]">
          <span>
            Press <kbd className="px-2 py-1 bg-[var(--bg-section)] rounded-md text-xs">Enter</kbd> to send, <kbd className="px-2 py-1 bg-[var(--bg-section)] rounded-md text-xs">Shift+Enter</kbd> for new line
          </span>
          {isGenerating && (
            <span className="flex items-center gap-2 text-[var(--border-focus)]">
              <div className="w-2 h-2 bg-[var(--border-focus)] rounded-full animate-pulse" />
              Generating response...
            </span>
          )}
        </div>
      </form>
    </div>
  )
}