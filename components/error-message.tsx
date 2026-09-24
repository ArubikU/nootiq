"use client"
import Link from 'next/link'
import { useTranslation } from "@/hooks/use-translation"
import "@/lib/i18n"

interface ErrorMessageProps {
  title?: string
  message?: string
  errorType?: 'account.not_found' | 'account.access_denied' | 'account.unauthorized' |
            'room.not_found' | 'room.access_denied' | 'room.limited' | 'room.creation_failed' |
            'document.not_found' | 'document.upload_failed' | 'document.processing_failed' |
            'flashcard.not_found' | 'flashcard.generation_failed' |
            'quiz.not_found' | 'quiz.generation_failed' |
            'payment.failed' | 'payment.subscription_expired' |
            'network.connection_failed' | 'network.server_error' | 'network.timeout' |
            'validation.invalid_email' | 'validation.required_field' | 'validation.file_too_large' | 'validation.invalid_file_type' |
            'generic.unexpected_error' | 'generic.maintenance'
  backLink?: boolean
  backLinkText?: string
  backLinkHref?: string
  backLinkType?: 'rooms' | 'dashboard' | 'home' | 'custom'
  showRetry?: boolean
  onRetry?: () => void
  showSupport?: boolean
}

export default function ErrorMessage({
  title,
  message,
  errorType,
  backLink = false,
  backLinkText,
  backLinkHref,
  backLinkType = 'rooms',
  showRetry = false,
  onRetry,
  showSupport = false
}: ErrorMessageProps) {
  const { t } = useTranslation()

  // Si se proporciona errorType, usar las traducciones
  const finalTitle = title || (errorType ? t(`errors.${errorType}.title`) : 'Error')
  const finalMessage = message || (errorType ? t(`errors.${errorType}.message`) : 'Ha ocurrido un error.')

  // Determinar el enlace de retorno según el tipo
  let finalBackLinkText = backLinkText
  let finalBackLinkHref = backLinkHref

  if (backLink && !backLinkText && !backLinkHref) {
    switch (backLinkType) {
      case 'rooms':
        finalBackLinkText = t('errors.buttons.back_to_rooms')
        finalBackLinkHref = '/rooms'
        break
      case 'dashboard':
        finalBackLinkText = t('errors.buttons.back_to_dashboard')
        finalBackLinkHref = '/dashboard'
        break
      case 'home':
        finalBackLinkText = t('errors.buttons.go_home')
        finalBackLinkHref = '/'
        break
      default:
        finalBackLinkText = t('errors.buttons.back_to_rooms')
        finalBackLinkHref = '/rooms'
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-100 rounded-full">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-red-600 mb-2">{finalTitle}</h1>
        <p className="text-text mb-6 text-lg">{finalMessage}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {backLink && finalBackLinkText && finalBackLinkHref && (
          <Link 
            href={finalBackLinkHref} 
            className="inline-flex items-center px-4 py-2 bg-accent-dark text-white rounded-lg shadow-md hover:bg-custom-accent transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {finalBackLinkText}
          </Link>
        )}

        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {t('errors.buttons.try_again')}
          </button>
        )}

        {showSupport && (
          <Link
            href="/contact"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {t('errors.buttons.contact_support')}
          </Link>
        )}
      </div>
    </div>
  )
}