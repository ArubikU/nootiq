"use client"

import React from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'
import { TranslationLoader } from '@/components/translation-loader'

interface I18nProviderProps {
  children: React.ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <TranslationLoader>
        {children}
      </TranslationLoader>
    </I18nextProvider>
  )
}
