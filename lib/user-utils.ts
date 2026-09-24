import { auth, clerkClient } from "@clerk/nextjs/server"
import { getUserByClerkId } from "./db"
import { getTierObject } from "./getLimits"

export interface UserContext {
  user: any
  userData: any
  userLanguage: string
  currentPlan: any
}

/**
 * Obtiene el contexto completo del usuario incluyendo idioma y plan
 */
export async function getUserContext(): Promise<UserContext | null> {
  try {
    const authObj = await auth()
    const { userId: clerkId } = authObj

    if (!clerkId) {
      return null
    }

    const user = await getUserByClerkId(clerkId)

    if (!user) {
      return null
    }

    const client = await clerkClient()
    const userData = await client.users.getUser(clerkId)
    
    const userLanguage = userData?.unsafeMetadata?.language as string || 
                        userData?.publicMetadata?.language as string || 
                        "es"
    
    const currentPlan = getTierObject(userData?.publicMetadata?.plan as string | undefined || "free")

    return {
      user,
      userData,
      userLanguage,
      currentPlan
    }
  } catch (error) {
    console.error("Error getting user context:", error)
    return null
  }
}

/**
 * Obtiene solo el idioma del usuario
 */
export async function getUserLanguage(): Promise<string> {
  const context = await getUserContext()
  return context?.userLanguage || "es"
}
