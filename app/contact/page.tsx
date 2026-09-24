"use client"

import { useTranslation } from "@/hooks/use-translation"
import "@/lib/i18n"
import Link from "next/link"
import { useState } from "react"

export default function ContactPage() {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const form = e.currentTarget
      const formData = new FormData(form)
      
      const response = await fetch("https://formspree.io/f/mqaqnwbe", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (response.ok) {
        setSubmitStatus('success')
        form.reset()
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">{t('contact.title')}</h1>
        <p className="text-xl text-center mb-12">
          {t('contact.subtitle')}
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <form
              onSubmit={handleSubmit}
              className=" p-8 rounded-lg shadow-lg space-y-6"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="w-full bg-secondary rounded-xl rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-accent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="w-full bg-secondary rounded-xl rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-accent"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  {t('contact.form.subject')}
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  required
                  className="w-full bg-secondary rounded-xl rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-accent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  {t('contact.form.message')}
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={5}
                  required
                  className="w-full bg-secondary rounded-xl rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-accent"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-accent hover:bg-accent-heavy transition-colors text-negated-secondary px-6 py-3 rounded-lg text-lg font-semibold w-full disabled:opacity-50"
              >
                {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
              </button>

              {submitStatus === 'success' && (
                <div className="bg-success border border-success text-negated-primary px-4 py-3 rounded">
                  {t('contact.form.success')}
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-error border border-error text-negated-primary px-4 py-3 rounded">
                  {t('contact.form.error')}
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-surface p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-6 text-primary">{t('contact.info.title')}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-primary">{t('contact.info.email')}</h3>
                <a href="mailto:nootiq.su@gmail.com" className="text-accent hover:underline">
                  nootiq.su@gmail.com
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-primary">{t('contact.info.response_time')}</h3>
                <p className="">{t('contact.info.response_time_value')}</p>
              </div>
              <div>
                <h3 className="font-semibold text-primary">{t('contact.info.support')}</h3>
                <p className="">{t('contact.info.support_value')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-accent font-semibold hover:underline">
            {t('contact.back_to_home')}
          </Link>
        </div>
      </div>
    </div>
  )
}
