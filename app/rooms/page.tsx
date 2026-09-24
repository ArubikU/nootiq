import { auth, clerkClient, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { createUser, getLeftRoomsCount, getRoomsByUserId, getUserByClerkId } from "@/lib/db"
import { getTierObject } from "@/lib/getLimits"
import { Room } from "@/lib/types"

import ErrorMessage from "@/components/error-message"
import DashboardRoomsClient from "./dashboard-rooms-client"

export default async function DashboardRoomsPage() {
  const authObj = await auth()
  const { userId: clerkId } = authObj

  if (!clerkId) redirect("/login")

  var user = await getUserByClerkId(clerkId)
  const duser = await currentUser()

  if (!user) {
    await createUser(clerkId, duser!.emailAddresses[0].emailAddress)
    user = await getUserByClerkId(clerkId)
    if (!user) {
      return (
        <ErrorMessage 
          errorType="account.not_found" 
          backLinkType="home" 
          backLink 
          showSupport 
        />
      )
    }
  }

  const client = await clerkClient()
  const userData = await client.users.getUser(clerkId)
  const currentPlan = getTierObject(userData?.publicMetadata?.plan as string | undefined || "free")
  const limits = currentPlan.limits
  const leftRoomsCount = await getLeftRoomsCount(authObj)
  const rooms: Room[] = await getRoomsByUserId(user.id)

  return (
    <DashboardRoomsClient 
      user={user}
      currentPlan={currentPlan}
      leftRoomsCount={leftRoomsCount}
      rooms={rooms}
    />
  )
}
