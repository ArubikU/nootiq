"use client"

import { Button } from "@/components/ui/button"
import { GenericDialog, GenericDialogContent, GenericDialogHeader, GenericDialogTitle } from "@/components/ui/gdialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useClerk, useUser } from "@clerk/nextjs"
import { LogOut, Menu, Settings, Shield, User } from 'lucide-react'
import Image from "next/image"
import React, { createContext, Fragment, useContext, useEffect, useState, type ReactNode } from "react"
import ProfileTab from "./clerk/profile-tab"
import ProtectedByClerkFooter from "./clerk/protected-by"
import SecurityTab from "./clerk/security-tab"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { GenericButton } from "./ui/gbutton"
import { useTranslation } from "@/hooks/use-translation"
// Tipos
type UserProfilePageProps = {
    label: string
    url: string
    labelIcon?: ReactNode
    children: ReactNode
}

// Contexto para compartir el estado del diálogo
type UserButtonContextType = {
    activeGenericDialog: string | null
    setActiveGenericDialog: (dialog: string | null) => void
    user: any
    signOut: () => Promise<void>
    requirePassword: <T>(callback: (password: string) => Promise<T>) => Promise<T | null>
}

// Contexto para compartir el estado del diálogo
const UserButtonContext = createContext<UserButtonContextType>({
    activeGenericDialog: null,
    setActiveGenericDialog: () => { },
    user: null,
    signOut: async () => { },
    requirePassword: async () => null,
})

// Hook para usar el contexto
export const useUserButton = () => useContext(UserButtonContext)

// Tipo para dispositivos
type DeviceType = {
    id: string
    type: string
    browser: string
    ip: string
    location: string
    lastActive: string
    isCurrentDevice: boolean
}

// Componente principal
function CustomUserButton({
    children,
    afterSignOutUrl = "/",
    showName = false,
}: {
    children?: ReactNode
    afterSignOutUrl?: string
    showName?: boolean
}) {
    const { t } = useTranslation()
    const { user, isLoaded, isSignedIn } = useUser()
    const { signOut: clerkSignOut } = useClerk()
    const [isOpen, setIsOpen] = useState(false)
    const [activeGenericDialog, setActiveGenericDialog] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("profile")
    // Simulamos los dispositivos activos
    const [devices, setDevices] = useState<DeviceType[]>([])

    const [isCurrentPasswordModalOpen, setIsCurrentPasswordModalOpen] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [currentPasswordError, setCurrentPasswordError] = useState("")
    const [isVerifyingPassword, setIsVerifyingPassword] = useState(false)
    const [currentCallback, setCurrentCallback] = useState<((password: string) => Promise<any>) | null>(null)
    const [currentResolve, setCurrentResolve] = useState<((value: any | null) => void) | null>(null)
    const [currentReject, setCurrentReject] = useState<((reason?: any) => void) | null>(null)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        
        checkMobile()
        window.addEventListener('resize', checkMobile)
        
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Function that takes a callback and returns a promise
    const requirePassword = async <T,>(callback: (password: string) => Promise<T>): Promise<T | null> => {
        return new Promise<T | null>((resolve, reject) => {
            setCurrentCallback(() => callback)
            setCurrentResolve(() => resolve)
            setCurrentReject(() => reject)
            setCurrentPassword("")
            setCurrentPasswordError("")
            setIsCurrentPasswordModalOpen(true)
        })
    }

    const handlePasswordVerification = async () => {
        if (!currentPassword) {
            setCurrentPasswordError(t('clerk.security.password_section.password_required') || "Password is required")
            return
        }

        setIsVerifyingPassword(true)
        try {
            // Password is verified, execute the callback
            if (currentCallback) {
                try {
                    const result = await currentCallback(currentPassword)


                    setIsCurrentPasswordModalOpen(false)
                    if (currentResolve) {
                        currentResolve(result)
                    }
                } catch (error: any) {
                    // The callback threw an error
                    console.error("Error in password callback:", error)
                    setCurrentPasswordError(error.message || "An error occurred during the operation")
                    if (currentReject) {
                        currentReject(error)
                    }
                }
            }
        } catch (error) {
            // Password verification failed
            setCurrentPasswordError("Incorrect password")
        } finally {
            setIsVerifyingPassword(false)
        }
    }

    const handleCancelPasswordModal = () => {
        setIsCurrentPasswordModalOpen(false)
        if (currentResolve) {
            currentResolve(null)
        }
        // Clean up
        setCurrentCallback(null)
        setCurrentResolve(null)
        setCurrentReject(null)
    }


    useEffect(() => {
        if (user) {
            user.getSessions().then((sessions) => {
                const activeDevices = sessions.map((session: any) => ({
                    id: session.id,
                    type: session.device?.type || "Unknown",
                    browser: session.browser,
                    ip: session.ipAddress,
                    location: session.location,
                    lastActive: new Date(session.lastActiveAt).toLocaleString(),
                    isCurrentDevice: session.isCurrentSession,
                }))
                setDevices(activeDevices)
            })
        }
    }, [user])

    // Función para cerrar sesión
    const handleSignOut = async () => {
        try {
            await clerkSignOut()
            window.location.href = afterSignOutUrl
        } catch (error) {
            console.error("Error al cerrar sesión:", error)
        }
    }

    // Si el usuario no está cargado, mostramos un estado de carga
    if (!isLoaded) {
        return (
            <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-secondary animate-pulse"></div>
                {showName && <div className="ml-2 h-4 w-20 bg-secondary animate-pulse rounded"></div>}
            </div>
        )
    }

    // Si no hay usuario, no mostramos nada
    if (!isSignedIn || !user) return null


    // Extraer las páginas personalizadas de los children
    const customPages = React.Children.toArray(children).filter(
        (child) => React.isValidElement(child) && child.type === UserProfilePage,
    ) as React.ReactElement<UserProfilePageProps>[]
    const customPagesPortals = React.Children.toArray(children).filter(
        (child) => React.isValidElement(child) && child.type === UserProfileLink,
    ) as React.ReactElement<UserProfilePageProps>[]
    return (
        <UserButtonContext.Provider
            value={{
                activeGenericDialog,
                setActiveGenericDialog,
                user,
                signOut: handleSignOut,
                requirePassword,
            }}
        >
            <header>
                {/* Dropdown del usuario */}
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <GenericButton  className={`p-0 touch-manipulation ${showName ? 'h-auto rounded-lg px-2 py-1' : 'h-8 w-8 rounded-full'}`}>
                            <div className="flex items-center">
                                {!showName && <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white from-primary to-accent hover:text-accent">
                                    <Image
                                        src={user.imageUrl}
                                        alt={user.fullName || "User Avatar"}
                                        width={32}
                                        height={32}
                                        className="object-cover w-full h-full"
                                        unoptimized
                                    />
                                </div>}
                                {showName && (
                                    <>
                                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white from-primary to-accent flex-shrink-0">
                                            <Image
                                                src={user.imageUrl}
                                                alt={user.fullName || "User Avatar"}
                                                width={32}
                                                height={32}
                                                className="object-cover w-full h-full"
                                                unoptimized
                                            />
                                        </div>
                                        <span className="ml-2 text-sm font-medium truncate max-w-[120px] hover:text-accent">{user.fullName}</span>
                                    </>
                                )}
                            </div>
                        </GenericButton>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 max-w-[calc(100vw-2rem)] p-0 bg-secondary border-none rounded-xl" align="end">
                        <div className="p-2 border-primary">
                            <div className="flex items-center gap-2 p-2">
                                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                                    <Image
                                        src={user.imageUrl || "/placeholder.svg?height=40&width=40"}
                                        alt={user.fullName || "User"}
                                        width={40}
                                        height={40}
                                        className="object-cover w-full h-full"
                                        unoptimized
                                    />
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="font-medium text-primary truncate">{user.fullName}</span>
                                    <span className="text-xs text-primary truncate">{user.primaryEmailAddress?.emailAddress}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-1 space-y-1">
                            <GenericButton
                                variant="accent"
                                className="w-full justify-start gap-2 px-5 py-3 text-sm min-h-[48px] transition-colors duration-200 rounded-lg"
                                onClick={() => setActiveGenericDialog("manage")}
                            >
                                <span className="mr-2">
                                    <Settings className="h-4 w-4" />
                                </span>
                                <span className="truncate">Manage account</span>
                            </GenericButton>
                            {customPagesPortals.map((page, index) => (
                                <React.Fragment key={index}>
                                    <div className="h-px bg-gradient-primary-to-transparent mx-4" />
                                    <GenericButton
                                        variant="none"
                                        className="w-full justify-start gap-2 px-5 py-3 text-sm text-accent hover:text-muted min-h-[48px] transition-colors duration-200 rounded-lg"
                                        onClick={() => setActiveGenericDialog(page.props.url)}
                                    >
                                        <span className="mr-2 flex-shrink-0">{page.props.labelIcon}</span>
                                        <span className="truncate">{page.props.label}</span>
                                    </GenericButton>
                                </React.Fragment>
                            ))}
                            <div className="h-px bg-gradient-primary-to-transparent mx-4" />
                            <GenericButton
                                variant="none"
                                className="w-full justify-start gap-2 px-5 py-3 text-sm text-primary min-h-[48px] hover:text-error transition-colors duration-200 rounded-lg"
                                onClick={handleSignOut}
                            >
                                <span className="mr-2 flex-shrink-0">
                                    <LogOut className="h-4 w-4" />
                                </span>
                                <span className="truncate">Sign out</span>
                            </GenericButton>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Diálogo de gestión de cuenta predeterminado */}
                <GenericDialog open={activeGenericDialog === "manage"} onOpenChange={(open) => !open && setActiveGenericDialog(null)}>

                    <GenericDialogContent className="rounded-xl border-surface max-w-4xl p-0 h-[80vh] max-h-[600px] w-[calc(100vw-1rem)] sm:w-full mx-2 sm:mx-auto flex overflow-hidden gap-0 text-secondary">
                        {/* Sidebar */}
                        <GenericDialogTitle className="hidden" />
                        {isMobile ? (
                            <div className="absolute bottom-6 right-6 z-10">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="p-3 bg-gray-800 text-white hover:bg-gray-700 shadow-xl border-2 border-gray-600 min-h-[48px] min-w-[48px] rounded-xl"
                                        >
                                            <Menu className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-48 bg-primary rounded-xl shadow-lg">
                                        <DropdownMenuItem 
                                            onClick={() => setActiveTab("profile")}
                                            className="min-h-[44px] px-4"
                                        >
                                            <User className="h-4 w-4 mr-2" />
                                            {t('common.profile')}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={() => setActiveTab("security")}
                                            className="min-h-[44px] px-4"
                                        >
                                            <Shield className="h-4 w-4 mr-2" />
                                            {t('common.security')}
                                        </DropdownMenuItem>
                                        {customPages.map((page, index) => (
                                            <DropdownMenuItem 
                                                key={index} 
                                                onClick={() => setActiveTab(page.props.url)}
                                                className="min-h-[44px] px-4"
                                            >
                                                <span className="mr-2">{page.props.labelIcon}</span>
                                                <span className="truncate">{page.props.label}</span>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <div className="w-64 h-full bg-primary border-primary flex flex-col">
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-primary">{t('clerk.account.title')}</h2>
                                    <p className="text-sm">{t('clerk.account.manage_info')}</p>
                                </div>
                                <div className="space-y-1 px-2 flex-1">
                                    <Button
                                        variant={activeTab === "profile" ? "secondary" : "ghost"}
                                        className={"w-full justify-start gap-2 px-2 py-1.5 text-sm min-h-[44px] rounded-lg" + (activeTab === "profile" ? "" : " text-accent")}
                                        onClick={() => setActiveTab("profile")}
                                    >
                                        <User className="h-4 w-4" />
                                        <span className="truncate">{t('common.profile')}</span>
                                    </Button>
                                    <Button
                                        variant={activeTab === "security" ? "secondary" : "ghost"}
                                        className={"w-full justify-start gap-2 px-2 py-1.5 text-sm min-h-[44px] rounded-lg" + (activeTab === "security" ? "" : " text-accent")}
                                        onClick={() => setActiveTab("security")}
                                    >
                                        <Shield className="h-4 w-4" />
                                        <span className="truncate">{t('common.security')}</span>
                                    </Button>
                                    {customPages.map((page, index) => (
                                        <Button
                                            key={index}
                                            variant={activeTab === page.props.url ? "secondary" : "ghost"}
                                            className={"w-full justify-start gap-2 px-2 py-1.5 text-sm min-h-[44px] rounded-lg" + (activeTab === page.props.url ? "" : " text-accent")}
                                            onClick={() => setActiveTab(page.props.url)}
                                        >
                                            <span className="flex-shrink-0">{page.props.labelIcon}</span>
                                            <span className="truncate">{page.props.label}</span>
                                        </Button>
                                    ))}
                                </div>
                                <div className="mt-auto">
                                    <ProtectedByClerkFooter />
                                </div>
                            </div>
                        )}

                        {/* Contenido principal */}
                        <div className="flex-1 overflow-auto rounded-tr-xl bg-quinary scrollbar-accent">
                            {/* Contenido de perfil */}
                            {activeTab === "profile" && (
                                <div className="p-4 sm:p-6">
                                    <ProfileTab></ProfileTab>
                                </div>
                            )}

                            {/* Contenido de seguridad */}
                            {activeTab === "security" && (
                                <div className="p-4 sm:p-6">
                                    <SecurityTab></SecurityTab>
                                </div>
                            )}
                            {activeTab !== "profile" && activeTab !== "security" && (
                                <div className="p-4 sm:p-6 space-y-8">
                                    {customPages.find((page) => page.props.url === activeTab)?.props.children}
                                </div>
                            )}
                        </div>
                    </GenericDialogContent>
                </GenericDialog>
                {/* Current Password Modal */}
                <GenericDialog
                    open={isCurrentPasswordModalOpen}
                    onOpenChange={(open) => {
                        if (!open) {
                            handleCancelPasswordModal();
                        }
                        setIsCurrentPasswordModalOpen(open)
                    }}
                >
                    <GenericDialogContent className="rounded-xl max-w-md w-full mx-4 sm:mx-auto p-6 bg-bg-light">
                        <GenericDialogTitle>{t('clerk.security.password_section.confirm_your_password')}</GenericDialogTitle>
                        <div className="space-y-4 py-4">
                            <p className="text-sm text-text">
                                {t('clerk.security.password_section.password_security_message')}
                            </p>
                            <div className="space-y-2">
                                <label htmlFor="current-password" className="text-sm font-medium">
                                    {t('clerk.security.password_section.current_password')}
                                </label>
                                <input
                                    id="current-password"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => {
                                        setCurrentPassword(e.target.value)
                                        setCurrentPasswordError("")
                                    }}
                                    className={`border rounded-xl px-4 py-3 w-full min-h-[44px] ${currentPasswordError ? "border-red-500" : ""}`}
                                    placeholder={t('clerk.security.password_section.enter_current_password')}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handlePasswordVerification()
                                        }
                                    }}
                                />
                                {currentPasswordError && <p className="text-sm text-red-500">{currentPasswordError}</p>}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                            <Button 
                                variant="ghost" 
                                className="hover:bg-gray-100 rounded-xl min-h-[44px] order-2 sm:order-1" 
                                onClick={handleCancelPasswordModal}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button
                                className="bg-gray-800 rounded-xl text-white hover:bg-text min-h-[44px] order-1 sm:order-2"
                                disabled={isVerifyingPassword || currentPassword.trim() === ""}
                                onClick={handlePasswordVerification}
                            >
                                {isVerifyingPassword ? t('common.verifying') : t('common.confirm')}
                            </Button>
                        </div>
                    </GenericDialogContent>
                </GenericDialog>
                {/* Update Password GenericDialog */}
                <GenericDialog open={activeGenericDialog === "updatePassword"} onOpenChange={(open) => !open && setActiveGenericDialog(null)}>
                    <GenericDialogContent className="rounded-xl max-w-md w-full mx-4 sm:mx-auto p-6 bg-bg-light">
                        <GenericDialogHeader>
                            <GenericDialogTitle>{t('clerk.security.password_section.update_your_password')}</GenericDialogTitle>
                        </GenericDialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label htmlFor="new-password" className="text-sm font-medium">
                                    {t('clerk.security.password_section.new_password')}
                                </label>
                                <input
                                    id="new-password"
                                    type="password"
                                    className="border rounded-xl px-4 py-3 w-full min-h-[44px]"
                                    placeholder={t('clerk.security.password_section.enter_new_password')}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="confirm-password" className="text-sm font-medium">
                                    {t('clerk.security.password_section.confirm_new_password')}
                                </label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    className="border rounded-xl px-4 py-3 w-full min-h-[44px]"
                                    placeholder={t('clerk.security.password_section.confirm_new_password_placeholder')}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                            <Button 
                                variant="ghost" 
                                className="hover:bg-gray-100 rounded-xl min-h-[44px] order-2 sm:order-1" 
                                onClick={() => setActiveGenericDialog(null)}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button 
                                className="bg-gray-800 rounded-xl text-white hover:bg-text min-h-[44px] order-1 sm:order-2"
                            >
                                {t('clerk.security.password_section.update_password')}
                            </Button>
                        </div>
                    </GenericDialogContent>
                </GenericDialog>
            </header>
        </UserButtonContext.Provider>
    )
}

// Componente para páginas de perfil personalizadas
function UserProfilePage({ label, url, labelIcon, children }: UserProfilePageProps) {
    const { setActiveGenericDialog } = useUserButton()

    return (
        <Fragment>
            <GenericDialogHeader className="sticky top-0 z-10 border-b p-4 flex flex-row items-center justify-between text-accent">
                <GenericDialogTitle>{label}</GenericDialogTitle>
            </GenericDialogHeader>
            <div className="p-6 overflow-auto">{children}</div>
        </Fragment>
    )
}
function UserProfileLink({ label, url, labelIcon }: UserProfilePageProps) {
    const { setActiveGenericDialog } = useUserButton()

    return (
        <Button
            variant="ghost"
            className="w-full justify-start gap-2 px-2 py-1.5 text-sm"
            onClick={() => setActiveGenericDialog(url)}
        >
            {labelIcon}
            {label}
        </Button>
    )
}

// Asignar el componente UserProfilePage como propiedad de CustomUserButton
CustomUserButton.UserProfilePage = UserProfilePage
CustomUserButton.UserProfileLink = UserProfileLink
export default CustomUserButton
