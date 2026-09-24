"use client"

import { BookOpenCheck, BrainCog, Lightbulb, UploadCloud, Users, Target, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import "@/lib/i18n";
import { useAuth } from "@clerk/nextjs";

export default function AboutPage() {
  const { t } = useTranslation();
  const { userId } = useAuth();

  return (
    <div className="bg-secondary">
            <div className="container mx-auto px-6 py-16 max-w-5xl">
        <h1 className="text-5xl font-extrabold text-center text-accent mb-8">{t('about.title')}</h1>
        <p className="text-center text-lg text-primary mb-12">
          {t('about.subtitle')}
        </p>

        {/* Sección: Misión */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-accent" />
            <h2 className="text-2xl font-bold text-primary">{t('about.mission.title')}</h2>
          </div>
          <p className="leading-relaxed">
            {t('about.mission.content')}
          </p>
        </section>

        {/* Sección: Historia */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="text-accent" />
            <h2 className="text-2xl font-bold text-primary">{t('about.story.title')}</h2>
          </div>
          <p className="text-text leading-relaxed">
            {t('about.story.content')}
          </p>
        </section>

        {/* Sección: Características */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-accent" />
            <h2 className="text-2xl font-bold text-primary">{t('about.features.title')}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {[
              {
                icon: <BrainCog className="w-8 h-8" />,
                title: t('about.features.ai_processing.title'),
                text: t('about.features.ai_processing.description')
              },
              {
                icon: <BookOpenCheck className="w-8 h-8" />,
                title: t('about.features.interactive_materials.title'),
                text: t('about.features.interactive_materials.description')
              },
              {
                icon: <UploadCloud className="w-8 h-8" />,
                title: t('about.features.organization.title'),
                text: t('about.features.organization.description')
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: t('about.features.progress_tracking.title'),
                text: t('about.features.progress_tracking.description')
              }
            ].map(({ icon, title, text }, idx) => (
              <div key={idx} className="bg-primary shadow-lg rounded-xl p-6 transition hover:scale-[1.02] duration-300">
                <div className="mb-4 text-accent">{icon}</div>
                <h3 className="font-semibold text-lg mb-2 text-primary">{title}</h3>
                <p >{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sección: Equipo
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-accent" />
            <h2 className="text-2xl font-bold text-primary">{t('about.team.title')}</h2>
          </div>
          <p className="text-text leading-relaxed">
            {t('about.team.description')}
          </p>
        </section> */}

        {/* CTA Final */}
        <div className="bg-accent-to-heavy rounded-2xl p-8 text-center text-negated-primary mb-8">
          <h2 className="text-3xl font-bold mb-4">{t('about.cta.title')}</h2>
          <p className="text-lg mb-6 opacity-90">{t('about.cta.description')}</p>
          <Link href={userId ? "/dashboard" : "/register"} legacyBehavior>
            <a className="bg-primary text-accent hover:bg-surface px-8 py-3 rounded-full text-lg font-semibold transition inline-block">
              {userId ? t('navbar.dashboard') : t('about.cta.button')}
            </a>
          </Link>
        </div>

          {/*
        <div className="text-center">
          <Link href="/" className="text-accent font-semibold hover:underline">
            ← Volver al inicio
          </Link>
        </div>
        */}
      </div>
    </div>
  )
}
