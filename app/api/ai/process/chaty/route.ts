import { questionText } from "@/lib/cohere"
import { createChatHistory, extractTextFromDocument, getChatHistoryByDocumentId, getSummaryById } from "@/lib/db"
import { chatHistory } from "@/lib/types"
import { createApiError, createSuccessResponse, handleApiError } from "@/lib/api-errors"
import { getUserContext } from "@/lib/user-utils"
import { auth } from "@clerk/nextjs/server"
import { type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const authObj = await auth()
    const { userId: clerkId } = authObj

    if (!clerkId) {
      return createApiError('UNAUTHORIZED')
    }

    const userContext = await getUserContext()

    if (!userContext) {
      return createApiError('USER_NOT_FOUND')
    }

    if(!(userContext.currentPlan.isUltimate || userContext.currentPlan.isUltra)){
        return createApiError('FORBIDDEN')
    }

    const { lastMessages, message, documentId } = await request.json()
    if (!lastMessages || !message || !documentId) {
      return createApiError('REQUIRED_FIELD', { fields: ['lastMessages', 'message', 'documentId'] })
    }
    const summary = await getSummaryById(documentId)
    const document = await extractTextFromDocument(documentId)
    const response = await questionText(message,  summary, "You are a chatbot from Nootiq devs, dont answer with things not related to study.",lastMessages,document, userContext.userLanguage)
    if (!response) {
      return createApiError('AI_GENERATION_FAILED')
    }
    createChatHistory(documentId, clerkId, message, response)
    return createSuccessResponse({ response }, 'Respuesta generada exitosamente')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(request: NextRequest) {
    try {
        const authObj = await auth()
        const { userId: clerkId } = authObj

        if (!clerkId) {
            return createApiError('UNAUTHORIZED')
        }

        const userContext = await getUserContext()

        if (!userContext) {
            return createApiError('USER_NOT_FOUND')
        }

        const { searchParams } = new URL(request.url)
        const documentId = searchParams.get('documentId')
        
        if (!documentId) {
            return createApiError('REQUIRED_FIELD', { field: 'documentId' })
        }
        
        const chat_history: chatHistory = await getChatHistoryByDocumentId(documentId, clerkId) as any
        if (!chat_history) {
            //return empty array if no chat history found
            return createSuccessResponse({ chat_history: [] })
        }
        return createSuccessResponse({ chat_history })
    } catch (error) {
        return handleApiError(error)
    }
}