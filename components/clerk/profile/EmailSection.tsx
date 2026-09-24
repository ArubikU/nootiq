"use client"

import { Badge } from "@/components/ui/badge"
import { useUser } from "@clerk/nextjs"
import { useTranslation } from "@/hooks/use-translation"

export default function EmailSection() {
    const { user, isLoaded } = useUser()
    const { t } = useTranslation()
    
    if (!isLoaded) return null
    if (!user) return null

    return (<>
        <h3 className="text-sm font-medium">{t('clerk.profile.email_section.title')}</h3>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span>{user.primaryEmailAddress?.emailAddress}</span>
                <Badge label={t('clerk.profile.email_section.primary')} variant="defaultrounded"/>
            </div>
        </div>
    </>)
}