"use client"

import { useTranslation } from "@/hooks/use-translation"
import ConnectedAccountsSection from "./profile/ConnectedAccountsSection"
import EmailSection from "./profile/EmailSection"
import ProfileSection from "./profile/ProfileSection"
import UsernameSection from "./profile/UsernameSection"

export default function ProfileTab() {
    const { t } = useTranslation()

    return (
        <div className="p-6 space-y-8 text-secondary">
            <h3 className="text-xl font-semibold mb-6">{t('clerk.profile.title')}</h3>

            <ProfileSection />
            {/* Username Section */}
            <UsernameSection />
            {/* Email Section */}
            <div className=" border-b" />
            <EmailSection />
            {/* Connected Accounts Section */}
            <div className=" border-b" />
            <ConnectedAccountsSection />
        </div>
    )
}