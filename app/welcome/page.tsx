'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Sparkles, 
  MessageSquare, 
  Code, 
  FileText, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Play
} from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { useChatStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function WelcomePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const { createConversation, setCurrentConversation } = useChatStore()

  const features = [
    {
      icon: MessageSquare,
      title: "Natural Conversations",
      description: "Chat naturally with AI that understands context and maintains conversation flow."
    },
    {
      icon: Code,
      title: "Code Assistance",
      description: "Get help with programming, debugging, and code reviews across multiple languages."
    },
    {
      icon: FileText,
      title: "Content Creation",
      description: "Generate, edit, and improve written content for any purpose or audience."
    },
    {
      icon: BarChart3,
      title: "Data Analysis",
      description: "Analyze data, create insights, and get help with complex problem-solving."
    }
  ]

  const quickStarts = [
    {
      title: "Ask a Question",
      description: "Get instant answers to any question",
      prompt: "Explain quantum computing in simple terms",
      icon: MessageSquare
    },
    {
      title: "Code Help",
      description: "Get programming assistance",
      prompt: "Help me write a React component for a todo list",
      icon: Code
    },
    {
      title: "Creative Writing",
      description: "Generate creative content",
      prompt: "Write a short story about a robot learning to paint",
      icon: FileText
    },
    {
      title: "Problem Solving",
      description: "Analyze and solve complex problems",
      prompt: "Help me plan a marketing strategy for a new app",
      icon: BarChart3
    }
  ]

  const tutorialSteps = [
    {
      title: "Start a Conversation",
      description: "Click 'New Chat' or use a quick start template to begin chatting with AI."
    },
    {
      title: "Explore Features",
      description: "Try different types of questions - from coding help to creative writing."
    },
    {
      title: "Manage Conversations",
      description: "Access your chat history, export conversations, and customize settings."
    }
  ]

  const handleQuickStart = (prompt: string) => {
    const conversationId = createConversation()
    setCurrentConversation(conversationId)
    router.push(`/?prompt=${encodeURIComponent(prompt)}`)
  }

  const handleGetStarted = () => {
    const conversationId = createConversation()
    setCurrentConversation(conversationId)
    router.push('/')
  }

  return (
    <MainLayout>
      <div className="h-full overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6">
          {/* Hero Section */}
          <div className="text-center py-12 mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                Cursor AI
              </span>
            </h1>
            
            <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto leading-relaxed">
              Your intelligent AI assistant for conversations, coding, creativity, and problem-solving. 
              Let's explore what we can accomplish together.
            </p>

            <Button 
              onClick={handleGetStarted}
              size="lg"
              variant="gradient"
              className="text-lg px-8 py-3"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-8">
              What Can I Help You With?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card key={index} className="text-center hover:shadow-[var(--shadow-card-hover)] transition-all hover:-translate-y-1">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Quick Start Templates */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-8">
              Quick Start Templates
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickStarts.map((template, index) => {
                const Icon = template.icon
                return (
                  <Card 
                    key={index} 
                    className="cursor-pointer hover:shadow-[var(--shadow-card-hover)] transition-all hover:-translate-y-1"
                    onClick={() => handleQuickStart(template.prompt)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--bg-section)] rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-[var(--text-primary)]" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.title}</CardTitle>
                          <p className="text-sm text-[var(--text-secondary)]">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-[var(--bg-section)] rounded-lg p-4 mb-4">
                        <p className="text-sm text-[var(--text-primary)] italic">
                          "{template.prompt}"
                        </p>
                      </div>
                      <Button variant="secondary" className="w-full">
                        <Play className="w-4 h-4 mr-2" />
                        Try This Example
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Tutorial Steps */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-8">
              How to Get Started
            </h2>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                {tutorialSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                        {step.title}
                      </h3>
                      <p className="text-[var(--text-secondary)] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tips */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Be specific in your questions for better responses</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Use follow-up questions to dive deeper into topics</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Try different AI models for varied perspectives</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Export important conversations for future reference</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Customize settings to match your preferences</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Use keyboard shortcuts for faster navigation</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center py-8">
            <Button 
              onClick={handleGetStarted}
              size="lg"
              variant="gradient"
              className="text-lg px-8 py-3"
            >
              Start Your First Conversation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}