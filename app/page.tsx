"use client"
import { MotionCard } from "@/components/ui/motion-card"
import { useAuth } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { useTranslation } from "@/hooks/use-translation"
import "@/lib/i18n"
import Link from "next/link"

export default function Home() {
  const { userId } = useAuth()
  const { t } = useTranslation()

  return (
    <main className="scroll-smooth">
      {/* HERO */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <motion.h1 
            className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-primary"
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            dangerouslySetInnerHTML={{ __html: t('home.hero.title') }}
          />
          <p className="text-lg md:text-xl text-text mb-8">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href={userId ? "/rooms" : "/register"} legacyBehavior>
              <a className="bg-accent hover:bg-accent-heavy text-light hover:text-light font-semibold py-3 px-6 rounded-xl shadow-md transition-all text-lg">
                {userId ? t('home.hero.cta_dashboard') : t('home.hero.cta_start')}
              </a>
            </Link>
            <Link href="#como-funciona" className="border border-accent border-2 text-primary hover:text-negated-primary font-semibold py-3 px-6 rounded-xl hover:bg-accent transition text-lg">
              {t('home.hero.cta_learn_more')}
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className="py-20 bg-secondary">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-16 text-primary">{t('home.how_it_works.title')}</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: t('home.how_it_works.steps.upload.title'), desc: t('home.how_it_works.steps.upload.description') },
              { title: t('home.how_it_works.steps.process.title'), desc: t('home.how_it_works.steps.process.description') },
              { title: t('home.how_it_works.steps.study.title'), desc: t('home.how_it_works.steps.study.description') },
            ].map((step, i) => (
              <motion.div 
                key={i}
                className="bg-primary p-8 rounded-2xl shadow-md text-center hover:shadow-lg transition"
                whileHover={{ scale: 1.03 }}
              >
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center text-light bg-accent rounded-full text-xl font-bold">
                  {i + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-primary">{step.title}</h3>
                <p className="text-secondary">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 ">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-16 text-primary">{t('home.features.title')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              [t('home.features.list.flashcards.title'), t('home.features.list.flashcards.description')],
              [t('home.features.list.quizzes.title'), t('home.features.list.quizzes.description')],
              [t('home.features.list.notebooks.title'), t('home.features.list.notebooks.description')],
              [t('home.features.list.export.title'), t('home.features.list.export.description')],
              [t('home.features.list.progress.title'), t('home.features.list.progress.description')],
              [t('home.features.list.customization.title'), t('home.features.list.customization.description')],
            ].map(([title, desc], i) => (
              <MotionCard title={title} description={desc} key={i} 
              className="py-4 px-4 pb-2 bg-accent text-light"></MotionCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-primary mb-6"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }}
          >
            {t('home.cta.title')}
          </motion.h2>
          <p className="text-lg text-secondary mb-8">
            {t('home.cta.subtitle')}
          </p>
          <Link href={userId ? "/rooms" : "/register"} legacyBehavior>
            <a className="bg-info text-negated-primary font-semibold py-3 px-8 rounded-xl text-lg hover:bg-gray-100 transition shadow">
              {userId ? t('home.cta.cta_dashboard') : t('home.cta.cta_register')}
            </a>
          </Link>
        </div>
      </section>
    </main>
  )
}
