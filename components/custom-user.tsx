"use client"
import { getTierObject } from "@/lib/getLimits";
import { onUpdateSettings } from "@/lib/updateUnsafe";
import { useUser } from "@clerk/nextjs";
import { CreditCard, Settings2, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CustomUserButton from "./custom-user-button";
import { getPlanById } from "./pricing/billingLabels";
import { useTranslation } from "@/hooks/use-translation";
import { CustomCheckbox } from "./ui/custom-checkbox";
import { LanguageSelector } from "./ui/language-selector";
import ThemeToggle from "./ui/theme-toggle";

export default function CustomUser({showName = false}: { showName?: boolean }) {
    const { t, i18n } = useTranslation()
    const { user, isLoaded } = useUser()
    const [settings, setSettings] = useState({
        emailNotifications: false,
        productUpdates: false,
        language: "es"
    })
    const [referralStats, setReferralStats] = useState<any>(null)

    useEffect(() => {
        if (isLoaded && user) {
            const userLanguage = user.unsafeMetadata.language as string || 
                                user.publicMetadata.language as string || 
                                "es"
            
            setSettings({
                emailNotifications: Boolean(user.unsafeMetadata.emailNotifications) || false,
                productUpdates: Boolean(user.unsafeMetadata.productUpdates) || false,
                language: userLanguage
            })

            // Actualizar el idioma de la interfaz si es diferente al actual
            if (i18n.language !== userLanguage) {
                i18n.changeLanguage(userLanguage)
            }

            // Fetch referral stats
            fetchReferralStats()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, user])

    const fetchReferralStats = async () => {
        try {
            const response = await fetch('/api/referral/stats')
            if (response.ok) {
                const data = await response.json()
                if (data.success) {
                    setReferralStats(data)
                }
            }
        } catch (error) {
            console.error('Error fetching referral stats:', error)
        }
    }

    const copyReferralLink = () => {
        if (referralStats?.code) {
            const referralUrl = `${window.location.origin}/register?ref=${referralStats.code}`
            navigator.clipboard.writeText(referralUrl)
            // Could add a toast notification here
        }
    }


    if (!isLoaded) return (<CustomUserButton afterSignOutUrl="/" />)

    // Get user plan from metadata
    const userTier = getTierObject((user?.publicMetadata?.plan as string) || "free")


    const userPlan = getPlanById(userTier.id, t)

    return (<header>
        <CustomUserButton afterSignOutUrl="/" showName={showName} >
            {/* You can pass the content as a component */}
            <CustomUserButton.UserProfilePage label="Settings" url="custom" labelIcon={<Settings2 />}>
                <div>
                    <h3 className="text-xl font-semibold mb-6">{t('clerk.settings.title')}</h3>

                    <div className="space-y-6">
                        {/* Notificaciones */}
                        <div>
                            <h4 className="font-medium mb-4">{t('clerk.settings.notifications.title')}</h4>
                            <div className="space-y-4">
                                <CustomCheckbox
                                    checked={!!settings.emailNotifications}
                                    onChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                                    label={t('clerk.settings.notifications.email_notifications')}
                                />
                                <CustomCheckbox
                                    checked={!!settings.productUpdates}
                                    onChange={(checked) => setSettings(prev => ({ ...prev, productUpdates: checked }))}
                                    label={t('clerk.settings.notifications.product_updates')}
                                />
                            </div>
                        </div>

                        {/* Apariencia */}
                        <div>
                            <h4 className="font-medium mb-4">{t('clerk.settings.appearance.title')}</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="flex flex-col sm:flex-row sm:items-center text-sm font-medium mb-2 gap-2">
                                        <span className="min-w-0 flex-shrink-0">{t('clerk.settings.appearance.language')}</span>
                                        <div className="w-full sm:w-auto">
                                            <LanguageSelector />
                                        </div>
                                    </label>
                                </div>
                                <div>
                                    <label className="flex flex-col sm:flex-row sm:items-center text-sm font-medium mb-2 gap-2">
                                        <span className="min-w-0 flex-shrink-0">{t('clerk.settings.appearance.theme')}</span>
                                        <div className="w-full sm:w-auto">
                                            <ThemeToggle />
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Guardar cambios */}
                    <div className="mt-8">
                        <button
                            className="bg-accent text-primary px-6 py-2 rounded font-medium hover:bg-accent-heavy transition"
                            onClick={() => {
                                onUpdateSettings(settings, user)
                            }}
                        >
                            {t('clerk.settings.save_changes')}
                        </button>
                    </div>
                </div>
            </CustomUserButton.UserProfilePage>
            <CustomUserButton.UserProfilePage label="Plan" url="billing" labelIcon={<CreditCard />}>
                <div className="">
                    <div className="flex  items-center mb-6">
                        <h3 className="text-xl font-semibold">{t('pricing.buttons.currentPlan')}</h3>
                    </div>

                    <div className="rounded-lg p-4 mb-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <h4 className={`${userTier.isUltimate ? "text-gradient-accent" : "text-primary"} font-semibold text-lg break-words`}>{userTier.formattedName}</h4>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded whitespace-nowrap">{t('common.active')}</span>
                                <Link href="/pricing" className="px-4 text-accent hover:underline text-sm font-medium whitespace-nowrap">
                                    {t('common.changePlan')}
                                </Link>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-4">Características del Plan</h3>
                    <div className="space-y-3">
                        {userPlan?.features?.map((feature, index) => (
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
            </CustomUserButton.UserProfilePage>
            <CustomUserButton.UserProfilePage label={t('referral.tab_title')} url="referrals" labelIcon={<Users />}>
                <div className="">
                    <div className="flex items-center mb-6">
                        <h3 className="text-xl font-semibold">{t('referral.title')}</h3>
                    </div>

                    {/* Referral Code Section */}
                    <div className=" rounded-lg p-6 mb-6">
                        <h4 className="font-semibold text-lg mb-4">{t('referral.your_code')}</h4>
                        
                        {referralStats ? (
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg p-4 gap-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-muted">{t('referral.your_referral_code')}</p>
                                        <p className="text-xl font-mono font-bold text-accent break-all">{referralStats.code}</p>
                                    </div>
                                    <button
                                        onClick={copyReferralLink}
                                        className="bg-accent text-negated-primary px-4 py-2 rounded font-medium hover:bg-accent-heavy transition whitespace-nowrap self-start sm:self-center"
                                    >
                                        {t('referral.copy_link')}
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="rounded-lg p-4 text-center">
                                        <p className="text-2xl font-bold text-accent">{referralStats.totalUses}</p>
                                        <p className="text-sm text-muted">{t('referral.total_referrals')}</p>
                                    </div>
                                    <div className="rounded-lg p-4 text-center">
                                        <p className="text-2xl font-bold text-success">{referralStats.usesLeft}</p>
                                        <p className="text-sm text-muted">{t('referral.remaining_uses')}</p>
                                    </div>
                                </div>
                                
                                {referralStats.claims && referralStats.claims.length > 0 && (
                                    <div>
                                        <h5 className="font-medium mb-3">{t('referral.recent_referrals')}</h5>
                                        <div className="space-y-2">
                                            {referralStats.claims.slice(0, 5).map((claim: any, index: number) => (
                                                <div key={index} className="rounded p-3 flex flex-col sm:flex-row sm:justify-between gap-2">
                                                    <span className="text-sm break-all">{claim.email}</span>
                                                    <span className="text-xs text-muted whitespace-nowrap">
                                                        {new Date(claim.claimed_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted mb-4">{t('referral.loading')}</p>
                            </div>
                        )}
                    </div>

                    {/* How it works */}
                    <div className="rounded-lg p-6">
                        <h4 className="font-semibold text-lg mb-4">{t('referral.how_it_works')}</h4>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <div className="bg-accent text-negated-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                                <p className="text-sm">{t('referral.step_1')}</p>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-accent text-negated-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                                <p className="text-sm">{t('referral.step_2')}</p>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-accent text-negated-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                                <p className="text-sm">{t('referral.step_3')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CustomUserButton.UserProfilePage>
        </CustomUserButton>
    </header>)
}