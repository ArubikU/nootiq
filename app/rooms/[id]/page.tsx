import DocumentList from "@/components/documents/document-list"
import DocumentUpload from "@/components/documents/upload-document"
import ErrorMessage from "@/components/error-message"
import { Card } from "@/components/ui/card"
import {
  canGenerateAi,
  getDocumentsByRoomId,
  getFlashcardsByRoomId,
  getQuizzesByRoomId,
  getRoomById,
  getUserByClerkId,
  thisRoomIsLimited,
  userOwnRoom,
} from "@/lib/db"
import { getTierObject, importTypes } from "@/lib/getLimits"
import { Quiz, Room } from "@/lib/types"
import { auth, clerkClient } from "@clerk/nextjs/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import GenerateFlashcardsButton from "../generate-flashcards"
import GenerateQuizButton from "../generate-quiz"
import ShortCards from "./flashcards/sample"
import ShortQuizzis from "./quizzes/sample"
import RoomContent from "./room-content"

export default async function RoomPage({ params }: { params: { id: string } }) {
  const authObj = await auth()
  const { userId: clerkId } = authObj
  if (!clerkId) redirect("/login")

  const user = await getUserByClerkId(clerkId)
  if (!user) return <ErrorMessage errorType="account.not_found" backLink showSupport />


  const ownRoom = await userOwnRoom(user.id, (await params).id)
  if (!ownRoom) {
    return <ErrorMessage errorType="room.access_denied" backLink />
  }

  const room: Room | null = await getRoomById((await params).id)
  if (!room) return <ErrorMessage errorType="room.not_found" backLink />
  if (room.user_id !== user.id) return <ErrorMessage errorType="room.access_denied" backLink />

  
  const client = await clerkClient()
  const userData = await client.users.getUser(clerkId)
  const currentPlan = getTierObject(userData?.publicMetadata?.plan as string | undefined || "free")

  const limited = await thisRoomIsLimited(room.id,user.id,currentPlan)
  if (limited) {
    return <ErrorMessage errorType="room.limited" backLink />
  }
  const documents:{
      id: string
      type: importTypes
      url: string
    }[] = await getDocumentsByRoomId(room.id) as any
  const quizzes: Quiz[] = await getQuizzesByRoomId(room.id)
  const flashcards = await getFlashcardsByRoomId(room.id)

  const limits = currentPlan.limits
  const { roomAiLimit, userAiMonthLimit } = await canGenerateAi(authObj, room.id, limits)

  return (
    <RoomContent
      room={room}
      documents={documents}
      flashcards={flashcards}
      quizzes={quizzes}
      roomAiLimit={roomAiLimit}
      userAiMonthLimit={userAiMonthLimit}
      limits={limits}
    />
  )
}