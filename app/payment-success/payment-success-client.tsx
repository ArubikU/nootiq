"use client"

import { useTranslation } from "@/hooks/use-translation"
import Link from "next/link"

interface PaymentSuccessClientProps {
  planName: string
}

export default function PaymentSuccessClient({ planName }: PaymentSuccessClientProps) {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">{t('paymentSuccess.title')}</h1>
        <p className="text-text mb-8">
          {t('paymentSuccess.message', { planName })}
        </p>
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="block w-full py-2 px-4 bg-custom-accent text-white font-medium rounded-md text-center hover:bg-accent-dark"
          >
            {t('paymentSuccess.go_to_dashboard')}
          </Link>
        </div>
      </div>
    </div>
  )
}
