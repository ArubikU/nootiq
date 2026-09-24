"use client"

import { Globe } from 'lucide-react'
import { useTranslation } from "@/hooks/use-translation"
import { useUser } from "@clerk/nextjs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function LanguageSelector() {
  const { i18n, t } = useTranslation()
  const { user } = useUser()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    
    // Actualizar en el perfil del usuario si está logueado
    if (user) {
      user.update({
        unsafeMetadata: { 
          ...(user.unsafeMetadata || {}), 
          language: lng 
        }
      }).catch((error) => {
        console.error("Error updating user language:", error)
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center justify-center w-full sm:w-auto min-h-[44px] px-3 py-2 text-primary hover:text-accent rounded-md transition-colors"
        >
          <Globe className="hover:text-accent h-5 w-5 mr-2" />
          <span className="hover:text-accent text-sm">{i18n.language === 'es' ? 'Español' : 'English'}</span>
          <span className="sr-only">{t('navbar.language')}</span>
        </button>
      </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="bg-secondary text-primary rounded-xl border-none shadow-xl min-w-[160px]">
      <DropdownMenuItem
        onClick={() => changeLanguage('es')}
        className="hover:bg-accent hover:text-primary transition-colors min-h-[44px] px-4 py-2"
      >
        <span className="mr-3">🇪🇸</span>
        <span>Español</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => changeLanguage('en')}
        className="hover:bg-accent hover:text-primary transition-colors min-h-[44px] px-4 py-2"
      >
        <span className="mr-3">🇺🇸</span>
        <span>English</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
    </DropdownMenu>
  )
}
