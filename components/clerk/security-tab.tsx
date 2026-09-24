"use client"

import { useUser } from "@clerk/nextjs"
import { useTranslation } from "@/hooks/use-translation"
import ActiveDevicesSection from "./security/ActiveDevicesSection"
import DeleteSection from "./security/DeleteSection"
import MfaSection from "./security/MfaSection"
import PasskeySection from "./security/PasskeySection"
import PasswordSection from "./security/PasswordSection"

export default function SecurityTab() {
    const { t } = useTranslation()
    const { user } = useUser();

    const showPassword = user?.passwordEnabled;
    const showPasskey = (user?.passkeys?.length ?? 0) > 0;
    const showMfa = user?.backupCodeEnabled || user?.totpEnabled ;
    const showDelete = user?.deleteSelfEnabled;

    return (
        <div className="p-6 space-y-8">
            <h3 className="text-xl font-semibold mb-6">{t('clerk.security.title')}</h3>
            
            {showPassword && <PasswordSection />}
            {showPasskey && <PasskeySection />}
            {showMfa && <MfaSection />}
            <ActiveDevicesSection />
            {showDelete && <DeleteSection />}
        </div>
    )
}