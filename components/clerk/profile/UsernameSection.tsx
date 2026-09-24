"use client"

import { Button } from "@/components/ui/button"
import { useReverification, useUser } from "@clerk/nextjs"
import { useTranslation } from "@/hooks/use-translation"
import { useState } from "react"

export default function UsernameSection() {
    const { user, isLoaded } = useUser()
    const { t } = useTranslation()
    const [userName, setUserName] = useState(user?.username || "")
    const [updatingUserName, setUpdatingUserName] = useState(false)

    if (!isLoaded || !user) return null

    const updateWithVerification = useReverification(values => user?.update(values))
    const hasUsername = user.username && user.username.trim() !== ""

    const content = () => {
        if (updatingUserName) {
            return (
                <div className="border rounded-xl p-6 shadow-sm bg-bg-light w-full max-w-md border-none bg-primary">
                    <h3 className="text-sm font-medium mb-4">{t('clerk.profile.username_section.update_username')}</h3>
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder={t('clerk.profile.username_section.username_placeholder')}
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="rounded-xl px-4 py-2 w-full bg-secondary border-none"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
                        <Button
                            variant="ghost"
                            className="hover:bg-muted bg-secondary rounded-xl"
                            onClick={() => setUpdatingUserName(false)}
                        >
                            {t('clerk.profile.username_section.cancel')}
                        </Button>
                        <Button
                            className="bg-secondary hover:bg-accent rounded-xl"
                            disabled={userName === (user.username || "")}
                            onClick={async () => {
                                updateWithVerification({ username: userName })
                                setUpdatingUserName(false)
                            }}
                        >
                            {t('clerk.profile.username_section.save')}
                        </Button>
                    </div>
                </div>
            )
        }

        return (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                <div>
                    {hasUsername ? (
                        <h3 className="text-md font-medium text-primary">{user.username}</h3>
                    ) : (
                        <h3 className="text-md font-medium text-primary">{t('clerk.profile.username_section.no_username')}</h3>
                    )}
                </div>
                <Button
                    className="bg-primary hover:bg-muted rounded-xl w-full sm:w-auto"
                    onClick={() => setUpdatingUserName(true)}
                >
                    {hasUsername ? t('clerk.profile.username_section.update_username') : t('clerk.profile.username_section.set_username')}
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 w-full max-w-xl">
            <h3 className="text-sm font-medium">{t('clerk.profile.username_section.title')}</h3>
            {content()}
        </div>
    )
}
