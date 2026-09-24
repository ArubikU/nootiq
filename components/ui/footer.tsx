"use client"

import { useTranslation } from "@/hooks/use-translation"

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-secondary border-t py-4 ">
      <div className="container mx-auto px-4 text-center text-text">
        &copy; {currentYear} Nootiq. {t('navbar.footer.rights')}
      </div>
    </footer>
  )
}
