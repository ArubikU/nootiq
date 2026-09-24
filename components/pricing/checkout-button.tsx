"use client";

import { createPayPalOrder } from "@/lib/paypal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CURRENCY } from "./billingLabels";
import { useTranslation } from "@/hooks/use-translation";

interface CheckoutButtonProps {
  planId: string;
  isCurrentPlan: boolean;
  billingPeriod?: string;
  disabled?: boolean;
  currency?: CURRENCY;
}

export default function CheckoutButton({ planId, isCurrentPlan, billingPeriod, disabled, currency }: CheckoutButtonProps) {
  const { t } = useTranslation()
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (disabled) {
    return (
      <button
        className="w-full py-2 px-4 bg-muted text-text font-medium rounded-md cursor-not-allowed"
        disabled
      >
        {t('pricing.buttons.alreadySuperior')}
      </button>
    );
  }

  // Free plan doesn't need checkout
  if (planId === "free") {
    return (
      <button
        className="w-full py-2 px-4 bg-muted-heavy text-white font-medium rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isCurrentPlan}
        onClick={() => router.push("/api/downgrade-to-free")}
      >
        {isCurrentPlan ? t('pricing.buttons.currentPlan') : t('pricing.buttons.forceToFree')}
      </button>
    );
  }

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      
      // Create PayPal order
      const order = await createPayPalOrder(
        planId,
        (billingPeriod || "monthly"),
        currency
      );

      // Find the approval URL
      const approvalLink = order.links.find(
        (link: any) => link.rel === "approve"
      );

      if (approvalLink) {
        window.location.href = approvalLink.href;
      } else {
        throw new Error("No approval link found in PayPal response");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(t('pricing.errors.paymentError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        className="w-full py-2 px-4 bg-accent text-white font-medium rounded-md hover:bg-accent-heavy disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleCheckout}
        disabled={isLoading || isCurrentPlan}
      >
        {isLoading
          ? t('pricing.buttons.processing')
          : isCurrentPlan
          ? t('pricing.buttons.currentPlan')
          : planId === "ultimate" 
          ? t('pricing.buttons.upgradeToUltimate')
          : t('pricing.buttons.upgradeToPremium')}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
