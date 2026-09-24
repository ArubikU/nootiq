"use client"
import { MotionCard } from "@/components/ui/motion-card"
import { useAuth } from "@clerk/nextjs"
import { motion } from "framer-motion"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"
import "@/lib/i18n"

export default function NotFoundPage() {
  const { userId } = useAuth()
  const { t } = useTranslation()

  const features = [
    {
      title: t('home.features.list.flashcards.title'),
      description: t('home.features.list.flashcards.description'),
      href: userId ? "/dashboard" : "/register"
    },
    {
      title: t('home.features.list.quizzes.title'),
      description: t('home.features.list.quizzes.description'),
      href: userId ? "/dashboard" : "/register"
    },
    {
      title: t('home.features.list.rooms.title'),
      description: t('home.features.list.rooms.description'),
      href: userId ? "/rooms" : "/register"
    }
  ]

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* 404 HERO SECTION */}
      <section className="py-24 bg-bg-light">
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="text-8xl md:text-9xl font-extrabold text-custom-accent mb-4">
              404
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight text-text"
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('notfound.title')}
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-text mb-4"
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {t('notfound.subtitle')}
          </motion.p>
          
          <motion.p 
            className="text-base md:text-lg text-text/80 mb-8"
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {t('notfound.description')}
          </motion.p>
          
          <motion.div 
            className="flex justify-center gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link href="/" legacyBehavior>
              <a className="bg-custom-accent hover:bg-accent-dark text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all text-lg">
                {t('notfound.cta_home')}
              </a>
            </Link>
            
            {userId && (
              <Link href="/dashboard" legacyBehavior>
                <a className="border border-custom-accent text-custom-accent font-semibold py-3 px-6 rounded-xl hover:bg-on-accent transition text-lg">
                  {t('notfound.cta_dashboard')}
                </a>
              </Link>
            )}
            
            {userId && (
              <Link href="/documents" legacyBehavior>
                <a className="border border-gray-300 text-text font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 transition text-lg">
                  {t('notfound.cta_documents')}
                </a>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* HELP SECTION */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.p 
            className="text-lg text-text mb-8"
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
          >
            {t('notfound.help_text')}
          </motion.p>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-bg-light">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: -20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            {t('home.features.title')}
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <Link href={feature.href} key={i} legacyBehavior>
                <a className="block">
                  <MotionCard 
                    title={feature.title} 
                    description={feature.description}
                    variant="surface"
                    className="py-4 px-4 pb-2 h-full hover:shadow-lg transition-shadow cursor-pointer"
                  />
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-custom-accent relative overflow-hidden">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
          >
            {t('home.cta.title')}
          </motion.h2>
          
          <motion.p 
            className="text-lg text-white/90 mb-8"
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('home.cta.subtitle')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href={userId ? "/dashboard" : "/register"} legacyBehavior>
              <a className="bg-bg-light text-custom-accent font-semibold py-3 px-8 rounded-xl text-lg hover:bg-gray-100 transition shadow">
                {userId ? t('home.cta.cta_dashboard') : t('home.cta.cta_register')}
              </a>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
