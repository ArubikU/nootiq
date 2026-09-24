import { generateFlashcards } from "@/lib/cohere"
import { consumeGenerations, createFlashcard, getSummariesByRoomId } from "@/lib/db"
import { trailListJson } from "@/lib/utils"
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

    const { roomId} = await request.json()

    if (!roomId ) {
      return createApiError('REQUIRED_FIELD', { field: 'roomId' })
    }
    const summaries = await getSummariesByRoomId(roomId)

    const flashCards = await generateFlashcards(summaries.join("\n\n"), false, "", userContext.userLanguage)
    if (!flashCards) {
      return createApiError('AI_GENERATION_FAILED')
    }
    let parsedFlashCards: { front: string; back: string; keywords: string }[] = []
    if (Array.isArray(flashCards)) {
      parsedFlashCards = flashCards.map((flashCard) => {
        return {
          front: flashCard.front,
          back: flashCard.back,
          keywords: flashCard.keywords
        }
      })
    }else{
      parsedFlashCards = JSON.parse(trailListJson(flashCards))
    }

    const created = await Promise.all(
      parsedFlashCards.map(async (flashCard: { front: string; back: string; keywords: string }) => {
        return await createFlashcard(roomId, flashCard.front, flashCard.back, flashCard.keywords)
      })
    )
    await consumeGenerations(authObj, roomId)
    const createdIds = created.map((flashCard) => flashCard.id)
    return createSuccessResponse({ ids: createdIds }, 'Flashcards generadas exitosamente')
  } catch (error) {
    return handleApiError(error)
  }
}
