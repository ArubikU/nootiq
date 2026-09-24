"use client"

import { getTierObject } from "@/lib/getLimits"
import { onUpdateSettings } from "@/lib/updateUnsafe"
import { useUser } from "@clerk/nextjs"
import { useTranslation } from "@/hooks/use-translation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getPlanById } from "../pricing/billingLabels"

interface UserProfileProps {
    publicMetadata: {
        plan?: string
        emailNotifications?: boolean
        productUpdates?: boolean
        language?: string
    },
}

export default function UserProfile({ publicMetadata }: UserProfileProps) {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState<"subscription" | "settings">("subscription")
    const {user,isLoaded} = useUser()
    const [settings, setSettings] = useState({
        emailNotifications: false,
        productUpdates: false,
        language: "es"
    })
    // Ensure settings are initialized from publicMetadata only once
    useEffect(() => {
        if(isLoaded){
            setSettings({
                emailNotifications: user?.unsafeMetadata.emailNotifications as any || false,
                productUpdates: user?.unsafeMetadata.productUpdates as any || false,
                language: user?.unsafeMetadata.language as any || "es"
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded])
    if(!isLoaded) return null
    // Get user plan from metadata
    const userPlan =  getTierObject((publicMetadata?.plan as string) || "free")

    const planFeatures = getPlanById(userPlan.id, t)?.features

    return (
        <div className="bg-bg-light rounded-lg shadow-md overflow-hidden">
            <div className="border-b">
                <div className="flex">
                    <button
                        className={`px-6 py-3 font-medium ${activeTab === "subscription" ? "border-b-2 border-custom-accent text-custom-accent" : "text-text"
                            }`}
                        onClick={() => setActiveTab("subscription")}
                    >
                        {t('userSettings.tabs.subscription')}
                    </button>
                    <button
                        className={`px-6 py-3 font-medium ${activeTab === "settings" ? "border-b-2 border-custom-accent text-custom-accent" : "text-text"
                            }`}
                        onClick={() => setActiveTab("settings")}
                    >
                        {t('userSettings.tabs.settings')}
                    </button>
                </div>
            </div>

            <div className="p-6">
                {activeTab === "subscription" ? (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">{t('pricing.buttons.currentPlan')}</h3>
                            <Link href="/pricing" className="text-custom-accent hover:underline text-sm font-medium">
                                {t('common.changePlan')}
                            </Link>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold text-lg">{userPlan.formattedName}</h4>
                                    <p className="text-text text-sm">
                                        {userPlan.isFree ? t('userSettings.plan.free') : userPlan.isPremium ? "S/ 49.99/mes" : "S/ 99.99/mes"}
                                    </p>
                                </div>
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">{t('userSettings.plan.active')}</span>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold mb-4">{t('userSettings.plan.features')}</h3>
                        <div className="space-y-3">
                            {planFeatures?.map((feature, index) => (
                                <div key={index} className="flex items-start">
                                    <svg
                                        className="h-5 w-5 text-green-600 mr-2 mt-0.5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M7.293 9.293a1 1 0 011.414 0L10 10.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" />
                                    </svg>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-xl font-semibold mb-6">{t('userSettings.account.title')}</h3>

                        <div className="space-y-6">
                            {/* Idioma */}
                            <div>
                                <h4 className="font-medium mb-2">{t('userSettings.language.title')}</h4>
                                <select
                                    className="input"
                                    value={settings.language}
                                    onChange={e => setSettings(prev => ({ ...prev, language: e.target.value }))}
                                >
                                    <option value="es">{t('userSettings.language.spanish')}</option>
                                    <option value="en">{t('userSettings.language.english')}</option>
                                </select>
                            </div>

                            {/* Notificaciones */}
                            <div>
                                <h4 className="font-medium mb-2">{t('userSettings.notifications.title')}</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded text-custom-accent focus:ring-custom-accent h-4 w-4 mr-2"
                                            checked={!!settings.emailNotifications}
                                            onChange={e => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                                        />
                                        <span>{t('userSettings.notifications.email')}</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded text-custom-accent focus:ring-custom-accent h-4 w-4 mr-2"
                                            checked={!!settings.productUpdates}
                                            onChange={e => setSettings(prev => ({ ...prev, productUpdates: e.target.checked }))}
                                        />
                                        <span>{t('userSettings.notifications.productUpdates')}</span>
                                    </label>
                                </div>
                            </div>

                            {/* Eliminar cuenta 
                            <div>
                                <h4 className="font-medium mb-2">Eliminar Cuenta</h4>
                                <p className="text-text text-sm mb-2">
                                    Esta acción eliminará permanentemente tu cuenta y todos tus datos.
                                </p>
                                <button className="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar mi cuenta</button>
                            </div>*/}
                        </div>

                        {/* Guardar cambios */}
                        <div className="mt-8">
                            <button
                                className="bg-custom-accent text-white px-6 py-2 rounded font-medium hover:bg-accent-dark transition"
                                onClick={() => {
                                    onUpdateSettings(settings,user)
                                }}
                            >
                                {t('userSettings.buttons.saveChanges')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
