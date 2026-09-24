"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useReverification, useUser } from "@clerk/nextjs"
import { OAuthProvider, OAuthStrategy } from "@clerk/types"
import { useTranslation } from "@/hooks/use-translation"
import { MoreHorizontal, Plus } from "lucide-react"

function formatOAuthProvider(provider: OAuthStrategy) {
    // Remove "oauth_" prefix and "_oidc" suffix, capitalize first letter only
    let name = provider.replace("oauth_", "").replace("_oidc", "");
    if (name === "github") name = "GitHub";
    else name = name.charAt(0).toUpperCase() + name.slice(1);
    return name;
}

function OAuthProviderToOAuthStrategy(provider: OAuthProvider): OAuthStrategy {
    return `oauth_${provider}` as OAuthStrategy;
}

function iconProvider(provider: OAuthStrategy) {
    switch (provider) {
        case "oauth_google":
            return <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <g>
                    <path d="M21.805 10.023h-9.765v3.977h5.637c-.243 1.243-1.37 3.65-5.637 3.65-3.39 0-6.15-2.803-6.15-6.25s2.76-6.25 6.15-6.25c1.93 0 3.23.82 3.97 1.52l2.71-2.63C17.09 2.98 14.97 2 12.5 2 6.98 2 2.5 6.48 2.5 12s4.48 10 10 10c5.74 0 9.52-4.03 9.52-9.72 0-.65-.07-1.14-.15-1.61z" fill="#FFC107" />
                    <path d="M3.653 7.345l3.27 2.4c.89-1.7 2.57-2.79 4.577-2.79 1.18 0 2.24.41 3.08 1.09l2.72-2.63C15.97 2.98 13.97 2 11.5 2 8.08 2 5.09 4.18 3.65 7.35z" fill="#FF3D00" />
                    <path d="M12.5 22c2.43 0 4.47-.8 5.96-2.18l-2.75-2.25c-.8.6-1.87.96-3.21.96-2.47 0-4.57-1.67-5.32-3.93l-3.23 2.5C5.09 19.82 8.08 22 12.5 22z" fill="#4CAF50" />
                    <path d="M21.805 10.023h-9.765v3.977h5.637c-.243 1.243-1.37 3.65-5.637 3.65-3.39 0-6.15-2.803-6.15-6.25s2.76-6.25 6.15-6.25c1.93 0 3.23.82 3.97 1.52l2.71-2.63C17.09 2.98 14.97 2 12.5 2 6.98 2 2.5 6.48 2.5 12s4.48 10 10 10c5.74 0 9.52-4.03 9.52-9.72 0-.65-.07-1.14-.15-1.61z" fill="#FFC107" fillOpacity=".2" />
                </g>
            </svg>
        case "oauth_github":
            return <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" fill="var(--text-primary)" />
            </svg>;
        case "oauth_linkedin_oidc":
            return <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <g>
                    <rect width="24" height="24" rx="4" fill="#0077B5" />
                    <path d="M7.75 17H5.5V9.5h2.25V17zM6.625 8.5a1.125 1.125 0 1 1 0-2.25 1.125 1.125 0 0 1 0 2.25zM18.5 17h-2.25v-3.25c0-.776-.014-1.775-1.083-1.775-1.084 0-1.25.847-1.25 1.72V17h-2.25V9.5h2.16v1.025h.03c.3-.567 1.034-1.166 2.13-1.166 2.278 0 2.7 1.5 2.7 3.448V17z" fill="#fff" />
                </g>
            </svg>;
        default:
            return null;
    }
}

function ConnectedAccountButton({ strategy }: { strategy: OAuthStrategy }) {
    const { user } = useUser()
    const createExternalAccount = useReverification(() => {
        const socialProvider = strategy.replace('oauth_', '') as OAuthProvider;
        const redirectUrl = window.location.href;
        const additionalScopes = [];

        return user?.createExternalAccount({
            strategy,
            redirectUrl,
        });
    });

    const connect = () => {
        if (!user) {
            return;
        }
        return createExternalAccount()
            .then(res => {
                if (res && res.verification?.externalVerificationRedirectURL) {
                    window.location.href = res.verification.externalVerificationRedirectURL.href;
                }
            })
            .catch(err => {
                // Handle error as needed, e.g., show a toast or log
                console.error(err);
            });
    };

    return (
        <Button
            className="justify-start"
            onClick={() => connect()}
        >
            {iconProvider(strategy)}
            {formatOAuthProvider(strategy)}
        </Button>
    )
}

function OptionsMenu({ strategy }: { strategy: OAuthStrategy }) {
    const { user } = useUser()
    const { t } = useTranslation()
    
    if (!user) return null
    const account = user.externalAccounts?.find((account: any) => strategy.includes(account.provider))
    if (!account) return null

    const isVerified = account.verification?.status === "verified"

    const createExternalAccount = useReverification(() => {
        const socialProvider = strategy.replace('oauth_', '') as OAuthProvider;
        const redirectUrl = window.location.href;
        const additionalScopes = [];

        return user?.createExternalAccount({
            strategy,
            redirectUrl,
        });
    });

    const connect = () => {
        if (!user) {
            return;
        }
        return createExternalAccount()
            .then(res => {
                if (res && res.verification?.externalVerificationRedirectURL) {
                    window.location.href = res.verification.externalVerificationRedirectURL.href;
                }
            })
            .catch(err => {
                // Handle error as needed, e.g., show a toast or log
                console.error(err);
            });
    };
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4 text-primary" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2 bg-gray-50 rounded-xl">
                <div className="flex flex-col gap-2">
                    {!isVerified ? (
                        <Button
                            variant="ghost"
                            className="justify-start hover:bg-gray-100"
                            onClick={() => connect()}
                        >
                            {iconProvider(strategy)}
                            {formatOAuthProvider(strategy)}
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2">
                            {iconProvider(strategy)}
                            <span>
                                {formatOAuthProvider(strategy)} <span className="ml-1 text-xs text-muted-foreground">({t('clerk.profile.connected_accounts.connected')})</span>
                            </span>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default function ConnectedAccountsSection() {
    const { user, isLoaded } = useUser()
    const { t } = useTranslation()
    
    if (!isLoaded) return null
    if (!user) return null

    const provider: OAuthStrategy[] = ["oauth_google", "oauth_github", "oauth_linkedin_oidc"];

    const noUsedProvider = provider.filter((p) => {
        const usedProvider = user?.externalAccounts?.some((account: any) => p.includes(account.provider))
        return !usedProvider
    })

    return (
        <>
            <h3 className="text-sm font-medium">{t('clerk.profile.connected_accounts.title')}</h3>
            {user.externalAccounts && user.externalAccounts.length > 0 ? (
                user.externalAccounts.map((account, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                {iconProvider(OAuthProviderToOAuthStrategy(account.provider))}
                                <span className={`${account.verification?.status === "verified" ? "" : "text-error"}`}>
                                    {account.provider.charAt(0).toUpperCase() + account.provider.slice(1).split("_")[0]}
                                </span>
                            </div>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">{account.verification?.status === "verified" ? account.firstName : t('clerk.profile.connected_accounts.unverified')}</span>
                        </div>
                        <OptionsMenu strategy={OAuthProviderToOAuthStrategy(account.provider)} />
                    </div>
                ))
            ) : (
                <span className="text-muted-foreground">{t('clerk.profile.connected_accounts.no_accounts')}</span>
            )}
            {noUsedProvider.length > 0 && (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button className="gap-1 mt-2">
                            <Plus className="h-4 w-4" />
                            {t('clerk.profile.connected_accounts.connect')}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2 bg-primary border-secondary rounded-xl">
                        <div className="flex flex-col gap-2">
                            {noUsedProvider.length === 0 ? (
                                <span className="text-sm text-muted-foreground">All providers connected</span>
                            ) : (
                                noUsedProvider.map((prov) => (
                                    <ConnectedAccountButton key={prov} strategy={prov} />
                                ))
                            )}
                        </div>
                    </PopoverContent>
                </Popover>
            )}
        </>
    )
}