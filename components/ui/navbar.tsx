"use client"

import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs"
import { AnimatePresence, motion, useScroll, useTransform, useMotionValue } from "framer-motion"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useTranslation } from "@/hooks/use-translation"
import CustomUser from "../custom-user"
import { LanguageSelector } from "./language-selector"
import { useTheme } from "@/hooks/use-theme"

export default function Navbar() {
  const { isSignedIn } = useUser()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { t } = useTranslation()
  const {theme} = useTheme()
  const [scrolled, setScrolled] = useState(false)
  // Fine-grained scroll interpolation
  const { scrollY } = useScroll()
  const progress = useTransform(scrollY, [0, 140], [0, 1], { clamp: true })
  const radius = useTransform(progress, v => `${v * 22}px`) // px (desktop only)
  const translateY = useTransform(progress, v => v * 6) // px (desktop only)
  const shadow = useTransform(progress, v => v === 0 ? 'none' : `0 6px 28px -12px rgba(0,0,0,${0.28 * v}), 0 2px 10px -4px rgba(0,0,0,${0.18 * v})`)
  const overlayOpacity = useTransform(progress, v => v)
  const borderWidth = useTransform(progress, v => v > 0 ? 1 : 0)
  const borderColor = useTransform(progress, v => `rgba(0,0,0,${0.12 + v * 0.25})`)
  const blurVal = useTransform(progress, v => 4 + v * 12)
  const satVal = useTransform(progress, v => 100 + v * 50)
  const brightnessVal = useTransform(progress, v => 1 + v * 0.05)
  const filterString = useMotionValue('none')
  useEffect(() => {
    const update = () => {
      const blur = blurVal.get()
      const sat = satVal.get()
      const bright = brightnessVal.get()
      filterString.set(`blur(${blur}px) saturate(${sat}%) brightness(${bright})`)
    }
    const unsub1 = blurVal.on('change', update)
    const unsub2 = satVal.on('change', update)
    const unsub3 = brightnessVal.on('change', update)
    update()
    return () => { unsub1(); unsub2(); unsub3() }
  }, [blurVal, satVal, brightnessVal, filterString])

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => {
      if (!scrolled && v > 34) setScrolled(true)
      else if (scrolled && v <= 34) setScrolled(false)
    })
    return () => { unsub() }
  }, [scrollY, scrolled])

  // Detect desktop (md:768px) to limit size reduction only there
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsDesktop('matches' in e ? e.matches : (e as MediaQueryList).matches)
    handler(mq)
    mq.addEventListener('change', handler as any)
    return () => mq.removeEventListener('change', handler as any)
  }, [])

  const closeMenu = () => setMobileOpen(false)

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      <Link
        href="/about"
        onClick={onClick}
        className={`block text-primary hover:text-accent hover:text-custom-accent px-3 py-2 rounded-md text-sm font-medium ${
          pathname === "/about" ? "text-custom-accent" : ""
        }`}
      >
        {t('navbar.about')}
      </Link>
          <Link
            href="/privacy"
            onClick={onClick}
            className={`block text-primary hover:text-accent hover:text-custom-accent px-3 py-2 rounded-md text-sm font-medium ${
              pathname === "/privacy" ? "text-custom-accent" : ""
            }`}
          >
            {t('navbar.privacy')}
          </Link>
      <Link
        href="/pricing"
        onClick={onClick}
        className={`block text-primary hover:text-accent hover:text-custom-accent px-3 py-2 rounded-md text-sm font-medium ${
          pathname === "/pricing" ? "text-custom-accent" : ""
        }`}
      >
        {t('navbar.pricing')}
      </Link>
      {isSignedIn && (
        <>
          <Link
            href="/rooms"
            onClick={onClick}
            className={`block text-primary hover:text-accent hover:text-custom-accent px-3 py-2 rounded-md text-sm font-medium ${
              pathname === "/rooms" || pathname === "/dashboard" ? "text-custom-accent" : ""
            }`}
          >
            {t('navbar.dashboard')}
          </Link>
        </>
      )}
    </>
  )

  return (
    // Sticky navbar with dynamic style on scroll
    <motion.nav
      data-scrolled={scrolled}
      className={`sticky top-0 left-0 right-0 z-50 nav-transition overflow-visible px-2 md:px-4 ${scrolled && isDesktop && !mobileOpen ? 'mx-auto md:max-w-screen-xl' : ''}`}
      style={{
        // Solidify when mobile menu is open
        borderRadius: (isDesktop && scrolled && !mobileOpen) ? radius : '0px' as any,
        y: (isDesktop && scrolled && !mobileOpen) ? translateY : 0 as any,
        boxShadow: (scrolled && !mobileOpen) ? shadow : 'none',
        borderWidth: (scrolled && !mobileOpen) ? (borderWidth as any) : 0,
        borderStyle: 'solid',
        borderColor: 'transparent',
        background: (scrolled && !mobileOpen) ? 'rgba(255,255,255,0.04)' : 'var(--bg-primary)',
        backdropFilter: (scrolled && !mobileOpen) ? (filterString as any) : 'none'
      }}
    >
      <div className={`container mx-auto px-2 md:px-4 transition-[padding] duration-500 ${(scrolled && isDesktop && !mobileOpen) ? 'py-1' : 'py-0'}`}>
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={scrolled && isDesktop ? 'logo' : 'imagotype'}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Image 
                    src={scrolled && isDesktop
                      ? (theme === 'dark' ? '/logo_white.svg' : '/logo.svg')
                      : (theme === 'dark' ? '/imagotype_white.svg' : '/imagotype.svg')
                    }
                    alt="Logo"
                    width={scrolled && isDesktop ? 48 : 128}
                    height={scrolled && isDesktop ? 48 : 64}
                  />
                </motion.div>
              </AnimatePresence>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLinks />
            <LanguageSelector />
            {isSignedIn ? (
              <CustomUser  />
            ) : (
              <>
                <SignInButton mode="redirect">
                  <button className="text-primary hover:text-custom-accent px-3 py-2 rounded-md text-sm font-medium">
                    {t('navbar.signin')}
                  </button>
                </SignInButton>
                <SignUpButton mode="redirect">
                  <button className="text-primary">{t('navbar.signup')}</button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-text hover:text-custom-accent focus:outline-none"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile nav with animation */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="mt-2 pb-4 border-t border-secondary">
                <ul className="flex flex-col gap-1 py-3">
                  {/* Nav links */}
                  <li className="px-1">
                    <NavLinks onClick={closeMenu} />
                  </li>
                  {/* Divider */}
                  <li className="mt-2 pt-3 border-t border-surface" />
                  {/* Language + Auth/User */}
                  <li className="pt-3 px-2 flex items-center justify-between gap-4">
                    <div className="shrink-0"><LanguageSelector /></div>
                    {isSignedIn ? (
                      <div className="flex items-center gap-2">
                        <CustomUser showName />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 w-full justify-end">
                        <SignInButton mode="redirect">
                          <button
                            onClick={closeMenu}
                            className="px-4 py-2 rounded-md text-sm font-medium bg-accent/10 hover:bg-accent/20 text-primary transition-colors"
                          >
                            {t('navbar.signin')}
                          </button>
                        </SignInButton>
                        <SignUpButton mode="redirect">
                          <button
                            onClick={closeMenu}
                            className="px-4 py-2 rounded-md text-sm font-semibold bg-accent text-light hover:bg-accent-heavy transition-colors"
                          >
                            {t('navbar.signup')}
                          </button>
                        </SignUpButton>
                      </div>
                    )}
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  </motion.nav>
  )
}
