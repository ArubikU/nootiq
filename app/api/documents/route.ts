import { createDocument, getDocumentsByRoomId, getUserByClerkId } from "@/lib/db"
import { getTierObject, importTypes } from "@/lib/getLimits"
import { createApiError, createSuccessResponse, handleApiError } from "@/lib/api-errors"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const authObj = await auth()
    const { userId: clerkId } = authObj

    if (!clerkId) {
      return createApiError('UNAUTHORIZED')
    }

    const user = await getUserByClerkId(clerkId)

    if (!user) {
      return createApiError('USER_NOT_FOUND')
    }

    const { roomId, url, type } = await request.json()

    if (!roomId || !url || !type) {
      return createApiError('REQUIRED_FIELD', { fields: ['roomId', 'url', 'type'] })
    }

    // Verificar el límite de archivos por sala
    const existingDocuments = await getDocumentsByRoomId(roomId)
    const client = await clerkClient()
    const userData = await client.users.getUser(clerkId)
    const currentPlan = getTierObject(userData?.publicMetadata?.plan as string | undefined || "free")
    const limits = currentPlan.limits

    if(currentPlan.importTypes.includes(type as importTypes) === false) {
      return createApiError('INVALID_FILE_TYPE', { allowedTypes: currentPlan.importTypes.join(', ') })
    }

    if (existingDocuments.length >= limits.filesPerRoom) {
      return createApiError('STORAGE_LIMIT_REACHED')
    }

    // Create document in database
    const documentId = await createDocument(roomId, url, type as importTypes)

    return createSuccessResponse({ id: documentId }, 'Documento creado exitosamente')
  } catch (error) {
    return handleApiError(error)
  }
}
