"use client"

import React from 'react'
import { useTranslation } from "@/hooks/use-translation"

interface TranslationLoaderProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Componente que maneja el estado de carga de las traducciones
 * Muestra un fallback mientras las traducciones se cargan
 */
export function TranslationLoader({ children, fallback }: TranslationLoaderProps) {
  const { ready } = useTranslation()
  
  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {fallback || (
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    )
  }
  
  return <>{children}</>
}
