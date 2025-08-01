"use client";

import ProtectedByClerkFooter from "@/components/clerk/protected-by";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const logoComponent = (<></>)
const OlogoComponent = (<motion.div
  className="h-16 w-16 bg-irisdark rounded-full mx-auto mb-6 flex items-center justify-center shadow-md shadow-irisdark/40"
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  <span className="text-2xl font-extrabold text-white">R</span>
</motion.div>)
export default function SignInPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 px-4 py-16">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="w-full  max-w-md space-y-8 rounded-3xl bg-ivory p-10 shadow-xl transition-all duration-300 hover:shadow-xl hover:shadow-irislight/50"
        >
          <header className="text-center">
            {logoComponent}
            <motion.h1
              className="text-2xl font-semibold text-ink"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Sign in to Nootiq
            </motion.h1>
            <motion.p
              className="mt-2 text-rage"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Welcome back! Please sign in to continue
            </motion.p>
          </header>


          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <Clerk.Connection
                name="google"
                className="flex items-center justify-center rounded-lg bg-gray-100 p-3 shadow-md transition-all duration-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <g>
                    <path d="M21.805 10.023h-9.765v3.977h5.637c-.243 1.243-1.37 3.65-5.637 3.65-3.39 0-6.15-2.803-6.15-6.25s2.76-6.25 6.15-6.25c1.93 0 3.23.82 3.97 1.52l2.71-2.63C17.09 2.98 14.97 2 12.5 2 6.98 2 2.5 6.48 2.5 12s4.48 10 10 10c5.74 0 9.52-4.03 9.52-9.72 0-.65-.07-1.14-.15-1.61z" fill="#FFC107" />
                    <path d="M3.653 7.345l3.27 2.4c.89-1.7 2.57-2.79 4.577-2.79 1.18 0 2.24.41 3.08 1.09l2.72-2.63C15.97 2.98 13.97 2 11.5 2 8.08 2 5.09 4.18 3.65 7.35z" fill="#FF3D00" />
                    <path d="M12.5 22c2.43 0 4.47-.8 5.96-2.18l-2.75-2.25c-.8.6-1.87.96-3.21.96-2.47 0-4.57-1.67-5.32-3.93l-3.23 2.5C5.09 19.82 8.08 22 12.5 22z" fill="#4CAF50" />
                    <path d="M21.805 10.023h-9.765v3.977h5.637c-.243 1.243-1.37 3.65-5.637 3.65-3.39 0-6.15-2.803-6.15-6.25s2.76-6.25 6.15-6.25c1.93 0 3.23.82 3.97 1.52l2.71-2.63C17.09 2.98 14.97 2 12.5 2 6.98 2 2.5 6.48 2.5 12s4.48 10 10 10c5.74 0 9.52-4.03 9.52-9.72 0-.65-.07-1.14-.15-1.61z" fill="#FFC107" fillOpacity=".2" />
                  </g>
                </svg>
              </Clerk.Connection>
              <Clerk.Connection
                name="github"
                className="flex items-center justify-center rounded-lg bg-gray-100 p-3 shadow-md transition-all duration-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" fill="#181717" />
                </svg>
              </Clerk.Connection>
              <Clerk.Connection
                name="linkedin_oidc"
                className="flex items-center justify-center rounded-lg bg-gray-100 p-3 shadow-md transition-all duration-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <g>
                    <rect width="24" height="24" rx="4" fill="#0077B5" />
                    <path d="M7.75 17H5.5V9.5h2.25V17zM6.625 8.5a1.125 1.125 0 1 1 0-2.25 1.125 1.125 0 0 1 0 2.25zM18.5 17h-2.25v-3.25c0-.776-.014-1.775-1.083-1.775-1.084 0-1.25.847-1.25 1.72V17h-2.25V9.5h2.16v1.025h.03c.3-.567 1.034-1.166 2.13-1.166 2.278 0 2.7 1.5 2.7 3.448V17z" fill="#fff" />
                  </g>
                </svg>
              </Clerk.Connection>
            </div>
          </div>
          <div className="relative mt-6 flex items-center">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-sm text-rage">or</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key="identifier"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Clerk.Field name="identifier" className="space-y-2">
                <Clerk.Label className="text-sm font-medium text-ink">Email address or username</Clerk.Label>
                <Clerk.Input
                  type="text"
                  required
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-irisdark"
                />
                <Clerk.FieldError className="block text-sm text-red-500" />
              </Clerk.Field>
              <Clerk.Field name="password" className="space-y-2">
                <Clerk.Label className="text-sm font-medium text-ink">Password</Clerk.Label>
                <Clerk.Input
                  type="password"
                  required
                  className="w-full rounded-full bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-irisdark"
                />
                <Clerk.FieldError className="block text-sm text-red-500" />
              </Clerk.Field>
              <SignIn.Action
                submit
                className="w-full rounded-xl bg-irisdark px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-iris focus:outline-none focus:ring-2 focus:ring-irisdark mt-4 flex items-center justify-center gap-2"
              >
                Continue
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
          <footer className="">

            <p className="text-center text-sm text-rage">
              Don’t have an account?{' '}
              <Clerk.Link
                navigate="sign-up"
                className="font-medium text-irisdark underline-offset-4 hover:underline"
              >
                Create one
              </Clerk.Link>
            </p>
            <ProtectedByClerkFooter></ProtectedByClerkFooter>
          </footer>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
}