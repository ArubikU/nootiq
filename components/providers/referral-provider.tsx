"use client";

import { useUser } from "@clerk/nextjs";
import { useReferralHandler } from "@/hooks/use-referral-handler";
import ReferralPopup from "@/components/referral/referral-popup";

export function ReferralProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useUser();
  const { popupData, closePopup } = useReferralHandler();

  return (
    <>
      {children}
      {isSignedIn && (
        <ReferralPopup
          isOpen={popupData.show}
          onClose={closePopup}
          planName={popupData.planName}
          planId={popupData.planId}
          duration={popupData.duration}
          features={popupData.features}
        />
      )}
    </>
  );
}
