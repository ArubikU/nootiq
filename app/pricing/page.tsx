
"use client"

import PricingTable from "@/components/pricing/pricing-table"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"
import "@/lib/i18n"

export default function PricingPage() {
  const { t } = useTranslation()

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-primary">{t('pricing.title')}</h1>
          <p className="text-xl max-w-3xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        <PricingTable />
        <div className="mt-12 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">{t('pricing.promo.title')}</h2>
          <Link
            href="/promo"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-accent-warm text-negated-primary font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-custom-accent focus:ring-offset-2"
          >
            <span className="mr-2">🎁</span>
            {t('pricing.promo.claim')}
          </Link>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4 text-primary">{t('pricing.support.title')}</h2>
          <p className="text-text mb-6">
            {t('pricing.support.description')}
          </p>
          <Link href="/contact" className="text-accent hover:underline font-medium">
            {t('pricing.support.contact')}
          </Link>
        </div>
      </div>
    </div>
  )
}
