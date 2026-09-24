"use client";

import ProtectedByClerkFooter from "@/components/clerk/protected-by";
import { useRedirectAfterAuth } from "@/hooks/use-redirect-after-auth";
import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import "@/lib/i18n";

const logoComponent = (
  <div className="flex justify-center mb-4">
    <img 
      src="/logo.svg" 
      alt="Logo" 
      className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain" 
    />
  </div>
);

export default function SignUpPage() {
  const [mounted, setMounted] = useState(false);
  const [showReferralField, setShowReferralField] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const { t } = useTranslation();
  const { isSignedIn } = useUser();
  const router = useRouter();
  const { handleRedirectAfterAuth } = useRedirectAfterAuth();

  useEffect(() => {
    setMounted(true);
    
    // Check for referral code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      setShowReferralField(true);
      // Save to localStorage for later use
      localStorage.setItem('pendingReferralCode', refCode);
    }

    // Also check localStorage for existing referral code
    const storedCode = localStorage.getItem('pendingReferralCode');
    if (storedCode && !refCode) {
      setReferralCode(storedCode);
      setShowReferralField(true);
    }
  }, []);

  // Manejar redirección después del registro exitoso
  useEffect(() => {
    if (isSignedIn && mounted) {
      // Intentar redireccionar a la URL guardada, si no existe ir al dashboard
      const redirected = handleRedirectAfterAuth();
      if (!redirected) {
        router.push('/dashboard');
      }
    }
  }, [isSignedIn, mounted, router, handleRedirectAfterAuth]);

  // Save referral code to localStorage when user types it
  const handleReferralCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setReferralCode(code);
    if (code.trim()) {
      localStorage.setItem('pendingReferralCode', code.trim());
    } else {
      localStorage.removeItem('pendingReferralCode');
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-secondary py-4">
      <SignUp.Root routing="virtual">
        <SignUp.Step
          name="start"
          className="w-full max-w-md bg-primary rounded-4xl p-10 shadow-3xl transition-all duration-300 hover:shadow-4xl hover:shadow-accent-light/50"
        >
          <header className="text-center">
            {logoComponent}
            <motion.h1
              className="text-2xl font-semibold text-primary"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('register.title')}
            </motion.h1>
            <motion.p
              className=" text-secondary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {t('register.subtitle')}
            </motion.p>
          </header>

          <Clerk.GlobalError className="block text-sm text-red-500" />

          <div className="mt-6 py-2">
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-4">
              <Clerk.Connection
                name="google"
                className="flex items-center justify-center rounded-xl bg-surface p-3 shadow-sm transition-all duration-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <img src="/google.svg" alt="Google" className="w-6 h-6" />
              </Clerk.Connection>
              <Clerk.Connection
                name="github"
                className="flex items-center justify-center rounded-xl bg-surface p-3 shadow-sm  transition-all duration-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <img src="/github.svg" alt="GitHub" className="w-6 h-6" />
              </Clerk.Connection>
              <Clerk.Connection
                name="linkedin_oidc"
                className="flex items-center justify-center rounded-xl bg-surface p-3 shadow-sm  transition-all duration-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <img src="/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
              </Clerk.Connection>
              </div>
            </div>
          </div>

          <div className="relative mt-2 mb-1 flex items-center">
            <div className="flex-grow border-t border-secondary" />
            <span className="mx-2 text-sm text-text-secondary">{t('register.social.title')}</span>
            <div className="flex-grow border-t border-secondary" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >

        <div className="grid grid-cols-2 gap-4 mt-2">
        <Clerk.Field name="firstName" className="py-3 space-y-1">
                  <div className="flex items-center justify-between">
          <Clerk.Label className="text-sm font-medium text-text">{t('register.form.first_name')}</Clerk.Label>
          <span className="ml-2 text-xs text-gray-400 rounded px-2 py-0.5">opcional</span>
                  </div>
                  <Clerk.Input
                    type="text"
          className="w-full rounded-xl bg-surface px-4 py-3 text-sm outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-dark shadow-xl"
                  />
                  <Clerk.FieldError className="block text-sm text-red-500" />
                </Clerk.Field>
        <Clerk.Field name="lastName" className="py-3 space-y-1">
                  <div className="flex items-center justify-between">
          <Clerk.Label className="text-sm font-medium text-text">{t('register.form.last_name')}</Clerk.Label>
          <span className="ml-2 text-xs text-gray-400  rounded px-2 py-0.5">opcional</span>
                  </div>
                  <Clerk.Input
                    type="text"
          className="w-full rounded-xl bg-surface px-4 py-3 text-sm outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-dark shadow-xl"
                  />
                  <Clerk.FieldError className="block text-sm text-red-500" />
                </Clerk.Field>
              </div>
        <Clerk.Field name="emailAddress" className="py-3 space-y-1">
                <Clerk.Label className="text-sm font-medium text-text">{t('register.form.email')}</Clerk.Label>
                <Clerk.Input
                  type="email"
                  required
          className="w-full rounded-xl bg-surface px-4 py-3 text-sm outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-dark shadow-xl"
                />
                <Clerk.FieldError className="block text-sm text-red-500" />
              </Clerk.Field>
<Clerk.Field name="password" className="py-3 space-y-1">
                <Clerk.Label className="text-sm font-medium text-text">{t('register.form.password')}</Clerk.Label>
                <Clerk.Input
                  type="password"
                  required
          className="w-full rounded-xl bg-surface px-4 py-3 text-sm outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-dark shadow-xl"
                />
                <Clerk.FieldError className="block text-sm text-red-500" />
              </Clerk.Field>

              {/* Referral Code Field */}
              <div className="py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowReferralField(!showReferralField)}
                    className="text-sm font-medium text-accent hover:text-accent-heavy transition-colors"
                  >
                    {showReferralField ? '🔽' : '▶️'} {t('register.form.referral_code', 'Referral Code')}
                  </button>
                  <span className="ml-2 text-xs text-gray-400 rounded px-2 py-0.5">opcional</span>
                </div>
                
                {showReferralField && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <input
                      type="text"
                      value={referralCode}
                      onChange={handleReferralCodeChange}
                      placeholder={t('register.form.referral_placeholder', 'Enter referral code')}
                      className="w-full rounded-xl bg-surface px-4 py-3 text-sm outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-dark shadow-xl"
                    />
                  </motion.div>
                )}
              </div>

              <div id="clerk-captcha" data-cl-size="flexible"  />
              <SignUp.Action
                submit
        className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-negated-primary shadow-md transition-all duration-300 hover:bg-custom-accent focus:outline-none focus:ring-2 focus:ring-accent-dark mt-4 flex items-center justify-center gap-2"
              >
                {t('register.form.sign_up')}
                <svg
                  className="w-5 h-5 ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </SignUp.Action>
            </motion.div>
          </AnimatePresence>

          <footer className="mt-4 space-y-8">
            <p className="text-center text-sm text-text-secondary">
              {t('register.have_account.text')}{" "}
              <Clerk.Link
                navigate="sign-in"
                className="font-medium text-accent underline-offset-4 hover:underline"
              >
                {t('register.have_account.link')}
              </Clerk.Link>
            </p>
          </footer>
        </SignUp.Step>
        <SignUp.Step
          name="verifications"
          className="w-full max-w-md bg-primary rounded-4xl p-10 shadow-3xl transition-all duration-300 hover:shadow-4xl hover:shadow-accent-light/50"
        >
          <header className="text-center">
            {logoComponent}
            <motion.h1
              className="text-2xl font-semibold text-primary"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('register.verification.title', 'Verify your email')}
            </motion.h1>
          </header>
          <Clerk.GlobalError className="block text-sm text-red-500" />
          <SignUp.Strategy name="email_code">
            <Clerk.Field name="code" className="py-3 space-y-1">
              <Clerk.Label className="text-sm font-medium text-text">{t('register.verification.code_label', 'Email code')}</Clerk.Label>
              <Clerk.Input
                type="otp"
                required
                className="w-full rounded-xl bg-surface px-4 py-3 text-sm outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-dark shadow-xl"
              />
              <Clerk.FieldError className="block text-sm text-red-500" />
            </Clerk.Field>
            <SignUp.Action
              submit
              className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-negated-primary shadow-md transition-all duration-300 hover:bg-custom-accent focus:outline-none focus:ring-2 focus:ring-accent-dark mt-4"
            >
              {t('register.verification.verify_button', 'Verify')}
            </SignUp.Action>
          </SignUp.Strategy>
        </SignUp.Step>
      </SignUp.Root>
    </div>
  );
}