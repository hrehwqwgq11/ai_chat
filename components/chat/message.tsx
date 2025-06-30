'use client'

import { useState } from 'react'
import { 
  Copy, 
  RotateCcw, 
  Trash2, 
  User, 
  Bot,
  Check,
  MoreVertical
} from 'lucide-react'
import { Message as MessageType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { formatRelativeTime, cn } from '@/lib/utils'

interface MessageProps {
  message: MessageType
  onCopy?: (content: string) => void
  onRegenerate?: (messageId: string) => void
  onDelete?: (messageId: string) => void
  isStreaming?: boolean
}

export function Message({ 
  message, 
  onCopy, 
  onRegenerate, 
  onDelete,
  isStreaming = false 
}: MessageProps) {
  const [copied, setCopied] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const handleCopy = async () => {
    if (onCopy) {
      onCopy(message.content)
    } else {
      await navigator.clipboard.writeText(message.content)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'

  return (
    <div 
      className={cn(
        "group relative flex gap-4 p-6 hover:bg-[var(--bg-section)] transition-colors",
        isUser && "bg-[var(--bg-section)]"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isUser ? "bg-[var(--brand-primary)]" : "bg-gradient-to-r from-purple-500 to-pink-500"
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className="text-xs text-[var(--text-muted)]">
            {formatRelativeTime(message.timestamp)}
          </span>
          {message.metadata?.model && (
            <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-card)] px-2 py-1 rounded">
              {message.metadata.model}
            </span>
          )}
        </div>

        <div className="prose prose-sm max-w-none text-[var(--text-primary)]">
          {/* Basic markdown-like rendering */}
          {message.content.split('\n').map((line, index) => {
            // Code blocks
            if (line.startsWith('```')) {
              return null // Handle in a more sophisticated way
            }
            
            // Inline code
            if (line.includes('`')) {
              const parts = line.split('`')
              return (
                <p key={index} className="mb-2">
                  {parts.map((part, i) => 
                    i % 2 === 0 ? (
                      part
                    ) : (
                      <code key={i} className="bg-[var(--bg-section)] px-1 py-0.5 rounded text-sm font-mono">
                        {part}
                      </code>
                    )
                  )}
                </p>
              )
            }
            
            // Regular text
            return line.trim() ? (
              <p key={index} className="mb-2 leading-relaxed">
                {line}
              </p>
            ) : (
              <br key={index} />
            )
          })}
          
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-[var(--text-primary)] animate-pulse ml-1" />
          )}
        </div>

        {message.metadata?.error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              Error: {message.metadata.error}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      {(showActions || copied) && !isStreaming && (
        <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-8 w-8"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          
          {isAssistant && onRegenerate && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRegenerate(message.id)}
              className="h-8 w-8"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(message.id)}
              className="h-8 w-8 text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}