import { CURRENCY, plans, WAYS_KEYS } from "@/components/pricing/billingLabels"
import { getLastestPayment } from "@/lib/db"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"


const exchangeRates = {
  PEN: 1, // Peruvian Sol
  USD: 3.8, // Example exchange rate, adjust as needed
  EUR: 4.2, // Example exchange rate, adjust as needed
}
const methods = {
  penToUsd: (amount: number) => Number.parseFloat((amount / exchangeRates.USD).toFixed(2)),
  penToEur: (amount: number) => Number.parseFloat((amount / exchangeRates.EUR).toFixed(2)),
  usdToPen: (amount: number) => Number.parseFloat((amount * exchangeRates.USD).toFixed(2)),
  usdToEur: (amount: number) => Number.parseFloat((amount * exchangeRates.USD / exchangeRates.EUR).toFixed(2)),
  eurToPen: (amount: number) => Number.parseFloat((amount * exchangeRates.EUR).toFixed(2)),
  eurToUsd: (amount: number) => Number.parseFloat((amount * exchangeRates.EUR / exchangeRates.USD).toFixed(2)),
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await auth()
    const { userId } = authUser

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    let { planId, period, currency } = await request.json()

    // Validate required fields
    if (!planId ) {
      console.error("Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    if(!currency) {
      currency = "PEN"
    }
    
  const currentPlan = user?.publicMetadata?.plan as string | undefined || "free"
  const lastestPayment = await getLastestPayment(userId)
    const currentPlanDetails = plans.find((plan) => plan.id === currentPlan ||  (plan.id === "ultimate" && currentPlan === "ultra"))
    const buyedPlanDetails = plans.find((plan) => plan.id === planId)
    if (!currentPlanDetails || !buyedPlanDetails) {
      return NextResponse.json({ error: "Invalid current plan" }, { status: 400 })
    }
    let isUpdate = currentPlan !== "free" && currentPlan !== planId
    let order = ["free", "premium", "ultimate", "ultra"]
    if (order.indexOf(planId) <= order.indexOf(currentPlan)) {
      isUpdate = false
    }
    let amount = buyedPlanDetails.prices[currency as CURRENCY][period as WAYS_KEYS] as number
    if (period === "monthly") {
      const exchangeRate = exchangeRates[currency as CURRENCY] || 1
      const latestPaymentAmount = lastestPayment?.payment_currency ? Number.parseFloat(currentPlanDetails.prices[lastestPayment?.payment_currency as CURRENCY][period as WAYS_KEYS].toString()) : 0
      if(isUpdate && lastestPayment){
        if(currency === "PEN") {
          if (lastestPayment.payment_currency === "USD") {
            amount = amount - methods.usdToPen(latestPaymentAmount)
          }
          else if (lastestPayment.payment_currency === "EUR") {
            amount = amount - methods.eurToPen(latestPaymentAmount)
          }
          else{
            amount = amount - latestPaymentAmount
          }
        }
        else if (currency === "USD") {
          if (lastestPayment.payment_currency === "PEN") {
            amount = amount - methods.penToUsd(latestPaymentAmount)
          }
          else if (lastestPayment.payment_currency === "EUR") {
            amount = amount - methods.eurToUsd(latestPaymentAmount)
          }
          else{
            amount = amount - latestPaymentAmount
          }
        }
        else if (currency === "EUR") {
          if (lastestPayment.payment_currency === "PEN") {
            amount = amount - methods.penToEur(latestPaymentAmount)
          }
          else if (lastestPayment.payment_currency === "USD") {
            amount = amount - methods.usdToEur(latestPaymentAmount)
          }
          else{
            amount = amount - latestPaymentAmount
          }
        }
        if (amount < 0) {
          amount = 0
        }
      }
    }else if (period === "quarterly") {
      amount = amount *  4
      isUpdate = false
    }
    else if (period === "yearly") {
      amount = amount * 12
      isUpdate = false
    }
    amount = Number.parseFloat(amount.toFixed(2))

    // Create PayPal order
    const paypalResponse = await fetch(`${process.env.PAYPAL_API_URL_PROD}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
        ).toString("base64")}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: planId,
            description: `Nootiq ${buyedPlanDetails.name} Plan`,
            amount: {
              currency_code: currency ,
              value: amount.toString(),
            },
          },
        ],
        application_context: {
          brand_name: "Nootiq",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/capture-order?planId=${planId}&userId=${userId}&isUpdate=${isUpdate}&period=${period}&currency=${currency}`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?cancelled=true`,
        },
      }),
    })

    if (!paypalResponse.ok) {
      const errorData = await paypalResponse.json()
      console.error("PayPal API error:", errorData)
      return NextResponse.json(
        { error: "Error creating PayPal order", details: errorData },
        { status: paypalResponse.status },
      )
    }

    const paypalData = await paypalResponse.json()

    return NextResponse.json({
      id: paypalData.id,
      links: paypalData.links,
      status: paypalData.status,
    })
  } catch (error) {
    console.error("Error creating PayPal order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
