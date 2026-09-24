"use client"

import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { useTranslation } from "@/hooks/use-translation"
import Image from "next/image"
import { useState } from "react"

function ProfileCard() {
    const { user, isLoaded } = useUser()
    const { t } = useTranslation()

    const [updatingProfile, setUpdatingProfile] = useState(false)

    const [firstName, setFirstName] = useState(user?.firstName || "")
    const [lastName, setLastName] = useState(user?.lastName || "")
    const [userProfileImage, setUserProfileImage] = useState(user?.imageUrl || "")
    const [userProfileImageFile, setUserProfileImageFile] = useState<Blob | null>(null)

    if (!isLoaded || !user) return null

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUserProfileImageFile(file)

        try {
            const reader = new FileReader()
            reader.onload = (event) => {
                if (event.target?.result) {
                    setUserProfileImage(event.target.result as string)
                }
            }
            reader.readAsDataURL(file)
        } catch (error) {
            console.error("Error loading file:", error)
        }
    }

    if (updatingProfile) {
        return (
            <div className="bg-primary border-none rounded-xl p-6 shadow-sm ">
                <h3 className="text-sm font-medium mb-4 text-secondary">{t('clerk.profile.profile_section.update_profile')}</h3>
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                    <Image
                        src={userProfileImage || "/placeholder.svg?height=64&width=64"}
                        alt={user.fullName || "User"}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-full"
                    />
                    <div className="flex flex-col items-start gap-2 w-full">
                        <input
                            type="file"
                            accept="image/*"
                            id="profile-image-upload"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="profile-image-upload" className="w-full">
                            <Button
                                type="button"
                                className="bg-secondary rounded-xl border-none hover:bg-accent w-full sm:w-auto"
                                asChild
                            >
                                <span>{t('clerk.profile.profile_section.upload')}</span>
                            </Button>
                        </label>
                        <p className="text-sm text-primary">{t('clerk.profile.profile_section.upload_recommendation')}</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder={t('clerk.profile.profile_section.first_name')}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="border-none rounded-xl px-4 py-2 w-full bg-secondary"
                    />
                    <input
                        type="text"
                        placeholder={t('clerk.profile.profile_section.last_name')}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="border-none rounded-xl px-4 py-2 w-full bg-secondary"
                    />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                    <Button
                        variant="ghost"
                        className="hover:bg-muted rounded-xl bg-secondary"
                        onClick={() => setUpdatingProfile(false)}
                    >
                        {t('clerk.profile.profile_section.cancel')}
                    </Button>
                    <Button
                        className="bg-secondary hover:bg-accent rounded-xl"
                        disabled={
                            firstName === (user.firstName || "") &&
                            lastName === (user.lastName || "") &&
                            userProfileImage === (user.imageUrl || "")
                        }
                        onClick={async () => {
                            if (userProfileImageFile) {
                                await user.setProfileImage({ file: userProfileImageFile })
                            }
                            await user.update({
                                firstName: firstName,
                                lastName: lastName,
                            })
                            setUserProfileImage(user.imageUrl || "")
                            setUserProfileImageFile(null)
                            setUpdatingProfile(false)
                        }}
                    >
                        {t('clerk.profile.profile_section.save')}
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
            <div className="flex-grow flex items-center gap-4">
                <Image
                    src={user.imageUrl || "/placeholder.svg?height=64&width=64"}
                    alt={user.fullName || "User"}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full"
                />
                <div className="flex flex-col">
                    <h3 className="text-md font-medium">{user.username}</h3>
                </div>
            </div>
            <div className="self-start sm:self-auto">
                <Button className="text-gray-900 bg-primary hover:bg-muted rounded-xl" onClick={() => setUpdatingProfile(true)}>
                    {t('clerk.profile.profile_section.update_profile')}
                </Button>
            </div>
        </div>
    )
}

export default function ProfileSection() {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col sm:flex-row items-start py-4 border-b gap-4">
            <p className="text-sm font-medium w-32 shrtext-0 mt-2 text-primary">{t('clerk.profile.profile_section.title')}</p>
            <div className="flex-grow">
                <ProfileCard />
            </div>
        </div>
    )
}
