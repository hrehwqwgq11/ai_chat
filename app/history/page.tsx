'use client'

import { useState } from 'react'
import { Search, Calendar, Download, Trash2, MessageSquare } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { useChatStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatRelativeTime, truncateText } from '@/lib/utils'
import { exportConversation } from '@/lib/api'

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConversations, setSelectedConversations] = useState<string[]>([])
  
  const { 
    conversations, 
    deleteConversation, 
    setCurrentConversation 
  } = useChatStore()

  const filteredConversations = conversations.filter(conversation => {
    const searchLower = searchQuery.toLowerCase()
    return (
      conversation.title.toLowerCase().includes(searchLower) ||
      conversation.messages.some(message => 
        message.content.toLowerCase().includes(searchLower)
      )
    )
  })

  const handleSelectConversation = (id: string) => {
    setSelectedConversations(prev => 
      prev.includes(id) 
        ? prev.filter(convId => convId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedConversations.length === filteredConversations.length) {
      setSelectedConversations([])
    } else {
      setSelectedConversations(filteredConversations.map(c => c.id))
    }
  }

  const handleDeleteSelected = () => {
    selectedConversations.forEach(id => deleteConversation(id))
    setSelectedConversations([])
  }

  const handleExportConversation = (conversation: any) => {
    const exported = exportConversation(conversation.messages, 'md')
    const blob = new Blob([exported], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${conversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleOpenConversation = (id: string) => {
    setCurrentConversation(id)
    window.location.href = '/'
  }

  return (
    <MainLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-[var(--border-light)] bg-[var(--bg-card)] p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Chat History
            </h1>
            
            {/* Search and filters */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button variant="secondary" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Filter by date
              </Button>
            </div>

            {/* Bulk actions */}
            {selectedConversations.length > 0 && (
              <div className="flex items-center gap-2 p-3 bg-[var(--bg-section)] rounded-lg">
                <span className="text-sm text-[var(--text-secondary)]">
                  {selectedConversations.length} selected
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-[var(--text-muted)] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                  {searchQuery ? 'No conversations found' : 'No conversations yet'}
                </h3>
                <p className="text-[var(--text-secondary)]">
                  {searchQuery 
                    ? 'Try adjusting your search terms'
                    : 'Start a new chat to see your conversation history here'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Select all */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedConversations.length === filteredConversations.length}
                    onChange={handleSelectAll}
                    className="rounded border-[var(--border-default)]"
                  />
                  <span className="text-sm text-[var(--text-secondary)]">
                    Select all ({filteredConversations.length})
                  </span>
                </div>

                {/* Conversations list */}
                {filteredConversations.map((conversation) => (
                  <Card 
                    key={conversation.id}
                    className="cursor-pointer hover:shadow-[var(--shadow-card-hover)] transition-all"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedConversations.includes(conversation.id)}
                            onChange={() => handleSelectConversation(conversation.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1 rounded border-[var(--border-default)]"
                          />
                          
                          <div 
                            className="flex-1 min-w-0"
                            onClick={() => handleOpenConversation(conversation.id)}
                          >
                            <CardTitle className="text-lg mb-2">
                              {conversation.title}
                            </CardTitle>
                            
                            <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                              <span>{formatDate(conversation.updatedAt)}</span>
                              <span>{conversation.messages.length} messages</span>
                              <span className="bg-[var(--bg-section)] px-2 py-1 rounded">
                                {conversation.model}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleExportConversation(conversation)
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteConversation(conversation.id)
                            }}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {conversation.messages.length > 0 && (
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {conversation.messages.slice(-2).map((message, index) => (
                            <div key={message.id} className="text-sm">
                              <span className="font-medium text-[var(--text-primary)]">
                                {message.role === 'user' ? 'You' : 'Assistant'}:
                              </span>
                              <span className="text-[var(--text-secondary)] ml-2">
                                {truncateText(message.content, 100)}
                              </span>
                            </div>
                          ))}
                          
                          {conversation.messages.length > 2 && (
                            <div className="text-xs text-[var(--text-muted)]">
                              +{conversation.messages.length - 2} more messages
                            </div>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}