import ErrorMessage from "@/components/error-message"
import { getQuizById, getRoomById, getUserByClerkId } from "@/lib/db"
import { Quiz } from "@/lib/types"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import QuizContent from "./quiz-content"


export default async function QuizPage({ params }: { params: { id: string; quizId: string } }) {
  const authObj = await auth()
  const { userId: clerkId } = authObj

  if (!clerkId) {
    redirect("/login")
  }

  // Get user from database
  const user = await getUserByClerkId(clerkId)

  if (!user) {
    return (
        <ErrorMessage 
          errorType="account.not_found" 
          backLinkType="dashboard" 
          backLink 
          showSupport 
        />
    )
  }

  // Get room details
  const room = await getRoomById((await params).id)

  // Check if user owns this room
  if (room && room.user_id !== user.id) {
    return (
        <ErrorMessage errorType="room.access_denied" backLink />
    )
  }

  // Get the specific quiz
  const param = await params
  const quiz: Quiz | null = await getQuizById(param.quizId)

  return (
      <QuizContent room={room} quiz={quiz} params={param} />
  )
}
