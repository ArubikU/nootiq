import { generateQuizQuestions } from "@/lib/cohere"
import { consumeGenerations, createQuiz, createQuizQuestion, getSummariesByRoomId } from "@/lib/db"
import { Quiz } from "@/lib/types"
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

    const { roomId } = await request.json()

    if (!roomId) {
      return createApiError('REQUIRED_FIELD', { field: 'roomId' })
    }
    const summaries = await getSummariesByRoomId(roomId)

    const quizs: Quiz = await generateQuizQuestions(summaries.join("\n\n"), false, "", userContext.userLanguage)
    if (!quizs) {
      return createApiError('AI_GENERATION_FAILED')
    }

    const createdQuiz = await createQuiz(
      roomId,
      quizs.title,
      quizs.description,
      quizs.source,
      quizs.difficulty,
      quizs.tags
    )

    //filter quizs.questions if question_text is not undefined or "undefined"
    quizs.questions = quizs.questions.filter(
      (quiz: any) => quiz.question_text !== undefined && quiz.question_text !== "undefined"
    )

    const questions = await Promise.all(
      quizs.questions.map(async (quiz: any) => {
        return await createQuizQuestion(
          createdQuiz,
          quiz.question_text,
          quiz.options,
          quiz.correct_option,
          quiz.difficulty
        )
      })
    )

    await consumeGenerations(authObj, roomId)
    const createdIds = questions.map((quiz) => quiz)
    return createSuccessResponse({ ids: createdIds }, 'Quiz generado exitosamente')
  } catch (error) {
    return handleApiError(error)
  }
}
