import { CURRENCY, plans, WAYS_KEYS } from "@/components/pricing/billingLabels"
import { storePayment, updateMetadata, updatePlanAndPayment } from "@/lib/db"
import { clerkClient } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get("token")
    const planId = searchParams.get("planId")
    const userId = searchParams.get("userId")
    const isUpdate = searchParams.get("isUpdate") === "true"
    const period = searchParams.get("period") || "monthly"
    const currency = searchParams.get("currency") || "PEN"


    const plan = plans.find((plan) => plan.id === planId)
    
    if (!orderId || !planId || !userId || !plan) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=missing_params`)
    }
    let waitedPrice = Number.parseFloat(plan.prices[currency as CURRENCY][period as WAYS_KEYS].toString())
    let days = 31
    if (period === "quarterly") {
      waitedPrice = waitedPrice * 4
      days = 92
    }
    else if (period === "yearly") {
      waitedPrice = waitedPrice * 12
      days = 365
    }

    waitedPrice = Number.parseFloat(waitedPrice.toFixed(2))

    // Capture the PayPal order
    const paypalResponse = await fetch(`${process.env.PAYPAL_API_URL_PROD}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
        ).toString("base64")}`,
      },
    })

    if (!paypalResponse.ok) {
      const errorData = await paypalResponse.json()
      console.error("PayPal capture error:", errorData)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=payment_failed`)
    }

    const paypalData = await paypalResponse.json()

    if (paypalData.status === "COMPLETED") {
      // Update user metadata with new plan
      const clerkClientInstance = await clerkClient()
      await updateMetadata(userId, clerkClientInstance, [{ key: "plan", value: planId }])

      // Store payment information in database
      await storePaymentInfo(userId, planId, paypalData,isUpdate, days)

      // Redirect to success page
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/payment-success?plan=${planId}`)
    } else {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=payment_incomplete`)
    }
  } catch (error) {
    console.error("Error capturing PayPal order:", error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=server_error`)
  }
}

async function storePaymentInfo(userId: string, planId: string, paypalData: any, isUpdate: boolean, days: number) {
  try {
    const paymentId = paypalData.id
    const paymentAmount = paypalData.purchase_units[0].payments.captures[0].amount.value
    const paymentCurrency = paypalData.purchase_units[0].payments.captures[0].amount.currency_code
    const paymentStatus = paypalData.status
    const paymentDate = new Date()
    if(isUpdate) {
      updatePlanAndPayment(userId, planId, paymentId, paymentAmount, paymentCurrency, paymentStatus)
    }else{
      storePayment(userId, planId, paymentId, paymentAmount, paymentCurrency, paymentStatus, paymentDate, days)
    }

  } catch (error) {
    console.error("Error storing payment info:", error)
  }
}
