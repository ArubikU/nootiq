import { createRoom, getLeftRoomsCount, getUserByClerkId, updateRoomCount } from "@/lib/db"
import { createApiError, createSuccessResponse, handleApiError } from "@/lib/api-errors"
import { auth } from "@clerk/nextjs/server"
import { type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const AuthObject = await auth()
    const { userId: clerkId } = AuthObject

    if (!clerkId) {
      return createApiError('UNAUTHORIZED')
    }

    const user = await getUserByClerkId(clerkId)
    if (!user) {
      return createApiError('USER_NOT_FOUND')
    }

    const leftRooms = await getLeftRoomsCount(AuthObject)
    if(leftRooms === 0) {
      return createApiError('ROOM_LIMIT_REACHED', undefined,undefined,{limitReached: true})
    }

    const { title, description, tags } = await request.json()

    if (!title) {
      return createApiError('REQUIRED_FIELD', { field: 'title' }, 'El título es requerido')
    }

    const roomId = await createRoom(user.id, title, description, tags)
    await updateRoomCount(AuthObject)
    
    return createSuccessResponse({ id: roomId }, 'Room creado exitosamente')
  } catch (error) {
    return handleApiError(error)
  }
}


