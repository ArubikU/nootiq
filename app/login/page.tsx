"use client";

import ProtectedByClerkFooter from "@/components/clerk/protected-by";
import { useRedirectAfterAuth } from "@/hooks/use-redirect-after-auth";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
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
export default function SignInPage() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();
  const { isSignedIn } = useUser();
  const router = useRouter();
  const { handleRedirectAfterAuth } = useRedirectAfterAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Manejar redirección después del login exitoso
  useEffect(() => {
    if (isSignedIn && mounted) {
      // Intentar redireccionar a la URL guardada, si no existe ir al dashboard
      const redirected = handleRedirectAfterAuth();
      if (!redirected) {
        router.push('/dashboard');
      }
    }
  }, [isSignedIn, mounted, router, handleRedirectAfterAuth]);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-secondary py-4">
      <SignIn.Root routing="virtual">
        <SignIn.Step
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
              {t('login.title')}
            </motion.h1>
            <motion.p
              className=" text-secondary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {t('login.subtitle')}
            </motion.p>
          </header>

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
            <span className="mx-2 text-sm text-text-secondary">{t('login.social.title')}</span>
            <div className="flex-grow border-t border-secondary" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key="identifier"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mt-2"
            >
              <Clerk.Field name="identifier" className="py-3 space-y-1">
                <Clerk.Label className="text-sm font-medium text-text">{t('login.form.email')}</Clerk.Label>
                <Clerk.Input
                  type="text"
                  required
                  className="w-full rounded-xl bg-surface px-4 py-3 text-sm outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-dark shadow-xl"
                />
                <Clerk.FieldError className="block text-sm text-error" />
              </Clerk.Field>
              <Clerk.Field name="password" className="py-3 space-y-1">
                <Clerk.Label className="text-sm font-medium text-text">{t('login.form.password')}</Clerk.Label>
                <Clerk.Input
                  type="password"
                  required
                  className="w-full rounded-xl bg-surface px-4 py-3 text-sm outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-dark shadow-xl"
                />
                <Clerk.FieldError className="block text-sm text-error" />
              </Clerk.Field>
              

              <SignIn.Action
                submit
                
                className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-negated-primary shadow-md transition-all duration-300 hover:bg-custom-accent focus:outline-none focus:ring-2 focus:ring-accent-dark mt-4 flex items-center justify-center gap-2"
              >
                {t('login.form.sign_in')}
                <svg
                  className="w-5 h-5 ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg></SignIn.Action>
            </motion.div>

          </AnimatePresence>
          <footer className="mt-4 space-y-8">

            <p className="text-center text-sm text-text-secondary">
              {t('login.no_account.text')}{' '}
              <Clerk.Link
                navigate="sign-up"
                className="font-medium text-accent underline-offset-4 hover:underline"
              >
                {t('login.no_account.link')}
              </Clerk.Link>
            </p>
          </footer>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
}