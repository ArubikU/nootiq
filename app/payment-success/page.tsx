import { getTierObject } from "@/lib/getLimits"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import PaymentSuccessClient from "./payment-success-client"

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { plan: string }
}) {
  const { userId } = await auth()
  const { plan } = searchParams

  if (!userId) {
    redirect("/login")
  }

  if (!plan) {
    redirect("/dashboard")
  } 

  const tierObject = getTierObject(plan)
  const planName = tierObject.formattedName

  return <PaymentSuccessClient planName={planName} />
}
