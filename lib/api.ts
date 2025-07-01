'use client'

import { Message } from './types'

// OpenRouter API configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

// Mock AI responses for demonstration (fallback when no API key)
const mockResponses = [
  "I'm a helpful AI assistant. How can I help you today?",
  "That's an interesting question! Let me think about that...",
  "I understand what you're asking. Here's my perspective on that topic:",
  "Great question! I'd be happy to help you with that.",
  "Let me break this down for you step by step:",
  "That's a complex topic. Here are some key points to consider:",
  "I can definitely help you with that. Here's what I recommend:",
  "Thanks for asking! Here's what I think about that:",
]

// Simulate typing delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Get API key from environment
function getApiKey(): string | null {
  if (typeof window !== 'undefined') {
    // Client-side: check for public env var
    return process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || null
  } else {
    // Server-side: check for private env var
    return process.env.OPENROUTER_API_KEY || null
  }
}

// OpenRouter streaming response
export async function* streamChatResponse(
  messages: Message[],
  model: string = 'meta-llama/llama-3.3-70b-instruct:free'
): AsyncGenerator<string, void, unknown> {
  const apiKey = getApiKey()
  
  // If no API key, use mock response
  if (!apiKey) {
    yield* streamMockResponse(messages, model)
    return
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
        'X-Title': 'Cursor AI Chat'
      },
      body: JSON.stringify({
        model: model,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        stream: true,
        temperature: 0.7,
        max_tokens: 2048
      })
    })

    if (!response.ok) {
      console.error(`OpenRouter API error: ${response.status}`)
      yield* streamMockResponse(messages, model)
      return
    }

    const reader = response.body?.getReader()
    if (!reader) {
      yield* streamMockResponse(messages, model)
      return
    }

    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') return

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content
              if (content) {
                yield content
              }
            } catch (e) {
              // Ignore parsing errors for malformed chunks
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  } catch (error) {
    console.error('OpenRouter API Error:', error)
    yield* streamMockResponse(messages, model)
  }
}

// Mock streaming response fallback
async function* streamMockResponse(
  messages: Message[],
  model: string
): AsyncGenerator<string, void, unknown> {
  // Get the last user message
  const lastMessage = messages[messages.length - 1]
  
  // Select a mock response
  const response = mockResponses[Math.floor(Math.random() * mockResponses.length)]
  
  // Add some context-aware responses
  let contextualResponse = response
  if (lastMessage?.content.toLowerCase().includes('hello') || lastMessage?.content.toLowerCase().includes('hi')) {
    contextualResponse = "Hello! I'm here to help. What would you like to know or discuss today?"
  } else if (lastMessage?.content.toLowerCase().includes('code') || lastMessage?.content.toLowerCase().includes('programming')) {
    contextualResponse = "I'd be happy to help you with coding! Here's what I can assist you with:\n\n```javascript\n// Example code\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n```\n\nWhat specific programming question do you have?"
  } else if (lastMessage?.content.toLowerCase().includes('explain')) {
    contextualResponse = "I'll explain that concept clearly for you. Let me break it down into digestible parts so you can understand it better."
  }
  
  // Add note about mock response
  contextualResponse += "\n\n**Note: This is a mock response. To get real AI responses, add your OpenRouter API key as NEXT_PUBLIC_OPENROUTER_API_KEY environment variable.**"
  
  // Simulate typing by yielding characters with delays
  const words = contextualResponse.split(' ')
  let currentText = ''
  
  for (let i = 0; i < words.length; i++) {
    currentText += (i > 0 ? ' ' : '') + words[i]
    yield currentText
    
    // Random delay between words to simulate realistic typing
    await delay(50 + Math.random() * 100)
  }
}

// Simple chat completion for non-streaming
export async function getChatCompletion(
  messages: Message[],
  model: string = 'meta-llama/llama-3.3-70b-instruct:free'
): Promise<string> {
  // Simulate API delay
  await delay(1000 + Math.random() * 2000)
  
  const lastMessage = messages[messages.length - 1]
  
  // Context-aware responses
  if (lastMessage?.content.toLowerCase().includes('hello') || lastMessage?.content.toLowerCase().includes('hi')) {
    return "Hello! I'm here to help. What would you like to know or discuss today?"
  }
  
  if (lastMessage?.content.toLowerCase().includes('code') || lastMessage?.content.toLowerCase().includes('programming')) {
    return `I'd be happy to help you with coding! Here's what I can assist you with:

\`\`\`javascript
// Example code
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

What specific programming question do you have?`
  }
  
  if (lastMessage?.content.toLowerCase().includes('explain')) {
    return "I'll explain that concept clearly for you. Let me break it down into digestible parts so you can understand it better."
  }
  
  // Return a random response
  return mockResponses[Math.floor(Math.random() * mockResponses.length)]
}

// Export conversation data
export function exportConversation(messages: Message[], format: 'json' | 'txt' | 'md' = 'json') {
  switch (format) {
    case 'txt':
      return messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')
    case 'md':
      return messages.map(m => `**${m.role.charAt(0).toUpperCase() + m.role.slice(1)}:** ${m.content}`).join('\n\n')
    case 'json':
    default:
      return JSON.stringify(messages, null, 2)
  }
}

// Import conversation data
export function importConversation(data: string, format: 'json' | 'txt' | 'md' = 'json'): Message[] {
  try {
    if (format === 'json') {
      return JSON.parse(data)
    }
    // For txt and md formats, we'd need more complex parsing
    // This is a simplified version
    return []
  } catch (error) {
    console.error('Failed to import conversation:', error)
    return []
  }
}