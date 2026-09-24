import ErrorMessage from "@/components/error-message"
import { getQuizzesByRoomId, getRoomById, getUserByClerkId, userOwnRoom } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import QuizzesContent from "./quizzes-content"

export default async function QuizzesPage({ params }: { params: { id: string } }) {
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

  const ownRoom = await userOwnRoom(user.id, (await params).id)
  if (!ownRoom) {
    return (
        <ErrorMessage errorType="room.access_denied" backLink />
    )
  }
  
  // Get room details
  const room = await getRoomById((await params).id)

  // Get quizzes for this room
  const quizzes = room ? await getQuizzesByRoomId(room.id) : []

  return (
      <QuizzesContent room={room} quizzes={quizzes} user={user} />
  )
}
