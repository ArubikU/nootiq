"use client"
// This file can be used to verify ownership with Google Search Console
// Replace 'YOUR_VERIFICATION_CODE' with the actual verification code from Google

import { useTranslation } from "@/hooks/use-translation"

export default function GoogleVerification() {
  const { t } = useTranslation()
  
  return (
    <html>
      <head>
        <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
      </head>
      <body>
        <h1>{t('seo.google_verification.title')}</h1>
        <p>{t('seo.google_verification.description')}</p>
      </body>
    </html>
  )
}
