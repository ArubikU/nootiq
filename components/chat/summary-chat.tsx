'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCustomAlerts } from "@/hooks/use-custom-alerts"
import { useErrorHandler } from "@/hooks/use-error-handler"
import { chatHistory } from "@/lib/types"
import { MathJax } from "better-react-mathjax"
import { Bot, MessageCircle, Send, User, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import { useTranslation } from "@/hooks/use-translation"
import Image from "next/image"

interface SummaryChatProps {
  documentId: string
  className?: string
}

interface Message {
  id: string
  message: string
  response: string
  created_at: string
  isUser: boolean
  content: string
}

export default function SummaryChat({ documentId, className }: SummaryChatProps) {
  const { t } = useTranslation()
  const { alert } = useCustomAlerts()
  const { handleError } = useErrorHandler()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Cargar historial de chat al abrir
  useEffect(() => {
    if (isOpen && documentId) {
      loadChatHistory()
    }
  }, [isOpen, documentId])

  // Auto-scroll al final cuando se agregan nuevos mensajes
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])
  const loadChatHistory = async () => {
    try {
      const response = await fetch(`/api/ai/process/chaty?documentId=${documentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error('Failed to load chat history')
      }

      const data = await response.json()
      
      if (data.chat_history && Array.isArray(data.chat_history)) {
        const formattedMessages: Message[] = []
        
        data.chat_history.forEach((chat: chatHistory) => {
          // Mensaje del usuario
          formattedMessages.push({
            id: `${chat.id}-user`,
            message: chat.message,
            response: '',
            created_at: chat.created_at,
            isUser: true,
            content: chat.message
          })
          
          // Respuesta del bot
          formattedMessages.push({
            id: `${chat.id}-bot`,
            message: '',
            response: chat.response,
            created_at: chat.created_at,
            isUser: false,
            content: chat.response
          })
        })
        
        setMessages(formattedMessages)
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
      alert(t('summaries.chat.load_error'), 'error')
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage("")
    setIsLoading(true)

    // Agregar mensaje del usuario inmediatamente
    const userMessageObj: Message = {
      id: `user-${Date.now()}`,
      message: userMessage,
      response: '',
      created_at: new Date().toISOString(),
      isUser: true,
      content: userMessage
    }
    
    setMessages(prev => [...prev, userMessageObj])

    try {
      // Preparar los últimos mensajes para contexto
      const lastMessages = messages.slice(-10).map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }))

      const response = await fetch('/api/ai/process/chaty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          documentId,
          lastMessages
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }

      const data = await response.json()
      
      // Agregar respuesta del bot
      const botMessageObj: Message = {
        id: `bot-${Date.now()}`,
        message: '',
        response: data.response,
        created_at: new Date().toISOString(),
        isUser: false,
        content: data.response
      }
      
      setMessages(prev => [...prev, botMessageObj])

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = error instanceof Error ? error.message : t('summaries.chat.error')
      alert(errorMessage, 'error')
      
      // Remover el mensaje del usuario si falló
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-24 w-24 shadow-lg hover:shadow-xl transition-all duration-200 bg-accent hover:bg-accent-heavy"
        >
          <Image
            src="/logo_white.svg"
            alt="Chat"
            width={48}
            height={48}
          />
        </Button>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className="w-96 h-[500px] shadow-2xl border-0 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
        <CardHeader className="bg-accent  rounded-t-2xl p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">{t('summaries.chat.title')}</h3>
            <Button
              variant="clean"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-heavy hover:text-light shadow-none"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex flex-col h-[420px]">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">{t('summaries.chat.empty_state')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                        message.isUser
                          ? 'bg-accent text-dark '
                          : 'bg-gray-100 text-dark'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {!message.isUser && <Bot className="h-4 w-4 mt-0.5 flex-shrtext-0" />}
                        {message.isUser && <User className="h-4 w-4 mt-0.5 flex-shrtext-0" />}
                        <div className="flex-1">                          {message.isUser ? (
                            <p>{message.content}</p>
                          ) : (
                            <MathJax dynamic hideUntilTypeset="every">
                              <ReactMarkdown
                                rehypePlugins={[rehypeHighlight]}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </MathJax>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(value) => setInputMessage(value)}
                onKeyPress={handleKeyPress}
                placeholder={t('summaries.chat.placeholder')}
                disabled={isLoading}
                className="flex-1 text-dark"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="sm"
                className="bg-accent hover:bg-accent-heavy"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
