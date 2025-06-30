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
    <div className="border-t border-[var(--border-light)] bg-[var(--bg-card)] p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3">
          {/* File attachment button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mb-2 flex-shrink-0"
            disabled={disabled}
          >
            <Paperclip className="h-4 w-4" />
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
                "min-h-[44px] max-h-[200px] resize-none pr-12 py-3",
                "focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent"
              )}
              rows={1}
            />
            
            {/* Character count */}
            {message.length > 0 && (
              <div className="absolute bottom-2 right-12 text-xs text-[var(--text-muted)]">
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
              className="mb-2 flex-shrink-0"
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!canSend}
              variant={canSend ? "gradient" : "secondary"}
              size="icon"
              className="mb-2 flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Hints */}
        <div className="flex items-center justify-between mt-2 text-xs text-[var(--text-muted)]">
          <span>
            Press Enter to send, Shift+Enter for new line
          </span>
          {isGenerating && (
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Generating response...
            </span>
          )}
        </div>
      </form>
    </div>
  )
}