"use client"

import { getTierObject } from "@/lib/getLimits"
import { useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { getBillingLabelsWithFallback, getPlans, CURRENCY, CURRENCY_AVALIABLE, CURRENCY_SYMBOLS, CURRENCY_SYMBOLS_AVAILABLE, plans, WAYS_KEYS } from "./billingLabels"
import CheckoutButton from "./checkout-button"
import { useTranslation } from "@/hooks/use-translation"

export default function PricingTable() {
  const { t } = useTranslation()
  const { isSignedIn, user } = useUser()
  const [billingPeriod, setBillingPeriod] = useState<WAYS_KEYS>("monthly")
  const [currency, setCurrency] = useState<CURRENCY_AVALIABLE>("USD")
  const currentPlan = getTierObject(user?.publicMetadata?.plan as string | undefined || "free")

  // Usar planes y labels traducidos
  const translatedPlans = getPlans(t)
  const billingLabels = getBillingLabelsWithFallback(t)
  
  const indexOfPlan = translatedPlans.findIndex((plan) => plan.id === currentPlan.id)

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      {/* Billing toggle */}
      <div className="flex justify-center mb-10">
        <div className=" rounded-full p-1 inline-flex shadow-lg bg-surface">
          {Object.keys(billingLabels).map((period) => (
            <button
              key={period}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                billingPeriod === period
                  ? "bg-accent text-negated-primary"
                  : "hover:bg-muted"
              }`}
              onClick={() => setBillingPeriod(period as any)}
            >
              {billingLabels[period]}
            </button>
          ))}
        </div>
        <div className="ml-4 rounded-full p-1 inline-flex shadow-lg bg-surface">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CURRENCY_AVALIABLE)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-terciary"
          >
            {Object.keys(CURRENCY_SYMBOLS_AVAILABLE).map((curr) => (
              <option key={curr} value={curr} className="bg-terciary border">
                {curr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory px-2 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible max-w-7xl mx-auto">
        {translatedPlans.map((plan, index) => {
          const price = plan.prices[currency as CURRENCY][billingPeriod]
          let isCurrent = currentPlan.id === plan.id
          if (plan.id === "ultimate" && currentPlan.id === "ultra") isCurrent = true

          const CardWrapper = motion.div
          return (
            <CardWrapper
              key={plan.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`snap-center min-w-[85%] md:min-w-0 rounded-3xl overflow-hidden shadow-xl flex flex-col h-full transform transition hover:scale-105
                ${plan.recommended
                  ? "border-4 border-accent scale-105 lg:scale-110"
                  : "bg-terciary"}
              `}
            >
              {plan.recommended && (
                <div className="bg-accent text-negated-primary text-center py-2 text-sm font-semibold uppercase tracking-wide">
                  {t('pricing.buttons.recommended')}
                </div>
              )}

              {!plan.recommended && (
                <div className={`text-center py-2 text-sm font-semibold uppercase tracking-wide
                
                ${index === translatedPlans.length - 1
          ? "accent-stripes-light text-negated-primary"
                  : "bg-quaternary"}
                `}>
                  {plan.id === "free" ? t('pricing.buttons.free') : t('pricing.buttons.ultimate')}
                </div>
              )}

              
              <div className={`p-6 border-b text-center md:text-left space-y-3 
                `}>
                <h3 className={`text-2xl font-extrabold mb-2` + (isCurrent ? " text-custom-accent" : "")}>
                  {plan.name}
                </h3>
                <p className="mb-4 min-h-[48px]">{plan.description}</p>
                <div className="flex items-end justify-center md:justify-start">
                  <span className="text-4xl font-bold">
                    {price === 0 ? `${CURRENCY_SYMBOLS[currency]} 0` : `${CURRENCY_SYMBOLS[currency]} ${price}`}
                  </span>
                  <span className="ml-1">{t('pricing.billing.perMonth')}</span>
                </div>
                {billingPeriod === "yearly" && plan.prices[currency].yearly !== 0 && (
                  <p className="text-sm text-success mt-1">
                    {t('pricing.billing.billedAnnually')} ({CURRENCY_SYMBOLS[currency]}{(plan.prices[currency].yearly * 12).toFixed(2)}{t('pricing.billing.year')})
                  </p>
                )}
                {billingPeriod === "quarterly" && plan.prices[currency].quarterly !== 0 && (
                  <p className="text-sm text-success mt-1">
                    {t('pricing.billing.billedQuarterly')} ({CURRENCY_SYMBOLS[currency]}{(plan.prices[currency].quarterly * 4).toFixed(2)}{t('pricing.billing.quarter')})
                  </p>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1 text-center md:text-left">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className={`flex items-start justify-center md:justify-start ${plan.recommended ? `${idx%2 === 0 ? "bg-on-accent/50" : "bg-irid=s-50/50"}` : ""} p-2 rounded-md`}>
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrtext-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.unavailable.map((feature, idx) => (
                    <li key={`x-${idx}`} className="flex items-start justify-center md:justify-start text-muted  p-2 rounded-md">
                      <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrtext-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  {isSignedIn ? (
                    <CheckoutButton planId={plan.id} isCurrentPlan={isCurrent} billingPeriod={billingPeriod} disabled={index < indexOfPlan} currency={currency}/>
                  ) : (
                    <Link
                      href="/register"
                      className="w-full py-2 px-4 bg-accent text-negated-primary font-semibold rounded-lg text-center block hover:bg-accent-heavy transition"
                    >
                      {price === 0 ? t('pricing.buttons.chooseFreePlan') : t('pricing.buttons.choosePlan')}
                    </Link>
                  )}
                </div>
              </div>
            </CardWrapper>
          )
        })}
      </div>
    </div>
  )
}
