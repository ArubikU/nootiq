import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useTranslation } from "./use-translation";
import { useCustomAlerts } from "./use-custom-alerts";
import { getPlanById } from "@/components/pricing/billingLabels";

interface ReferralPopupData {
  show: boolean;
  planName: string;
  planId: string;
  duration: number;
  features: string[];
}

export function useReferralHandler() {
  const { user, isLoaded } = useUser();
  const { t } = useTranslation();
  const { alert } = useCustomAlerts();
  const [popupData, setPopupData] = useState<ReferralPopupData>({
    show: false,
    planName: "",
    planId: "",
    duration: 0,
    features: []
  });

  useEffect(() => {
    if (!isLoaded || !user) return;

    const handleReferralClaim = async () => {
      const pendingCode = localStorage.getItem('pendingReferralCode');
      if (!pendingCode) return;

      // Check if user already has a referral assigned
      const hasReferral = user.unsafeMetadata?.hasClaimedReferral || 
                         user.publicMetadata?.hasClaimedReferral ||
                         user.unsafeMetadata?.referred_by ||
                         user.publicMetadata?.referred_by;

      if (hasReferral) {
        // User already has a referral, remove from localStorage
        localStorage.removeItem('pendingReferralCode');
        return;
      }

      try {
        const response = await fetch('/api/referral/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ referralCode: pendingCode })
        });

        const data = await response.json();

        if (data.success) {
          // Remove from localStorage
          localStorage.removeItem('pendingReferralCode');
          
          // Get plan information dynamically
          const planInfo = getPlanById(data.planId || 'premium', t);
          const planName = planInfo?.name || 'Premium';
          const features = planInfo?.features || [
            t('referral.popup.features.unlimited_rooms'),
            t('referral.popup.features.advanced_ai'),
            t('referral.popup.features.priority_support')
          ];

          // Show success popup
          setPopupData({
            show: true,
            planName: planName,
            planId: data.planId || 'premium',
            duration: data.duration || 1,
            features: features
          });

          // Mark user as having claimed referral to prevent future attempts
          await user.update({
            unsafeMetadata: {
              ...user.unsafeMetadata,
              hasClaimedReferral: true,
              referred_by: data.referrerId
            }
          });

          // Show alert
          alert(t('referral.popup.success_message'), 'success');
        } else {
          console.error('Failed to claim referral:', data.error);
          // Don't remove from localStorage in case of temporary error
          if (data.error?.includes('already used') || data.error?.includes('not found')) {
            localStorage.removeItem('pendingReferralCode');
          }
        }
      } catch (error) {
        console.error('Error claiming referral:', error);
      }
    };

    // Wait a bit for user to be fully loaded
    const timer = setTimeout(handleReferralClaim, 1000);
    return () => clearTimeout(timer);
  }, [isLoaded, user, t, alert]);

  const closePopup = () => {
    setPopupData(prev => ({ ...prev, show: false }));
  };

  return {
    popupData,
    closePopup
  };
}
