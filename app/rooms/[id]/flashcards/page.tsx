import ErrorMessage from "@/components/error-message"
import { getFlashcardsByRoomId, getRoomById, getUserByClerkId, userOwnRoom } from "@/lib/db"
import { getTierObject } from "@/lib/getLimits"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import FlashcardsClient from "./flashcards-client"

export default async function RoomFlashcardsPage({
    params,
}: {
    params: { id: string }
}) {
    const authObject = await auth()
    const { userId: clerkId } = authObject
    const roomId = (await params).id

    if (!clerkId) {
        redirect("/login")
    }

    // Get user from database
    const user = await getUserByClerkId(clerkId)
    

    const client = await clerkClient()
    const userData = await client.users.getUser(clerkId)
    const currentPlan = userData?.publicMetadata?.plan as string | undefined || "free"
    const plan = getTierObject(currentPlan)

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
    const room = await getRoomById(roomId)

    // Get flashcards from room
    const flashcards = await getFlashcardsByRoomId(roomId)

    return (
          <FlashcardsClient 
            roomId={roomId}
            room={room}
            flashcards={flashcards}
            plan={plan}
            user={user}
          />
    )
}
