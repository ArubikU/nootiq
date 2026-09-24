"use client"

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export interface ErrorState {
  hasError: boolean
  errorType?: string
  message?: string
  details?: any
}

export function useErrorHandler() {
  const { t } = useTranslation()
  const [error, setError] = useState<ErrorState>({ hasError: false })

  const clearError = useCallback(() => {
    setError({ hasError: false })
  }, [])

  const handleError = useCallback((error: any) => {
    console.error('Error handled:', error)
    
    // Si es un error de API estandarizado
    if (error?.error?.code) {
      setError({
        hasError: true,
        errorType: error.error.code,
        message: error.error.message,
        details: error.error.details,
      })
      return
    }

    // Si es un error de fetch
    if (error?.response?.data?.error) {
      setError({
        hasError: true,
        errorType: error.response.data.error.code,
        message: error.response.data.error.message,
        details: error.response.data.error.details,
      })
      return
    }

    // Error genérico
    setError({
      hasError: true,
      errorType: 'GENERIC_ERROR',
      message: error?.message || t('errors.generic.unexpected_error.message'),
    })
  }, [t])

  const getErrorMessage = useCallback((errorType?: string, fallbackMessage?: string) => {
    if (!errorType) return fallbackMessage || t('errors.generic.unexpected_error.message')

    // Mapear códigos de error de API a las traducciones
    const errorMapping: Record<string, string> = {
      UNAUTHORIZED: 'errors.account.unauthorized.message',
      FORBIDDEN: 'errors.account.access_denied.message',
      USER_NOT_FOUND: 'errors.account.not_found.message',
      ACCOUNT_NOT_FOUND: 'errors.account.not_found.message',
      ROOM_NOT_FOUND: 'errors.room.not_found.message',
      ROOM_LIMIT_REACHED: 'errors.room.limited.message',
      DOCUMENT_NOT_FOUND: 'errors.document.not_found.message',
      FLASHCARD_NOT_FOUND: 'errors.flashcard.not_found.message',
      QUIZ_NOT_FOUND: 'errors.quiz.not_found.message',
      PROCESSING_FAILED: 'errors.document.processing_failed.message',
      AI_GENERATION_FAILED: 'errors.flashcard.generation_failed.message',
      UPLOAD_FAILED: 'errors.document.upload_failed.message',
      PAYMENT_FAILED: 'errors.payment.failed.message',
      SUBSCRIPTION_EXPIRED: 'errors.payment.subscription_expired.message',
      INTERNAL_ERROR: 'errors.network.server_error.message',
      DATABASE_ERROR: 'errors.network.server_error.message',
      EXTERNAL_API_ERROR: 'errors.network.connection_failed.message',
      INVALID_INPUT: 'errors.validation.invalid_email.message',
      REQUIRED_FIELD: 'errors.validation.required_field.message',
      FILE_TOO_LARGE: 'errors.validation.file_too_large.message',
      INVALID_FILE_TYPE: 'errors.validation.invalid_file_type.message',
    }

    const translationKey = errorMapping[errorType]
    if (translationKey) {
      return t(translationKey)
    }

    return fallbackMessage || t('errors.generic.unexpected_error.message')
  }, [t])

  const getErrorTitle = useCallback((errorType?: string) => {
    if (!errorType) return t('errors.generic.unexpected_error.title')

    const titleMapping: Record<string, string> = {
      UNAUTHORIZED: 'errors.account.unauthorized.title',
      FORBIDDEN: 'errors.account.access_denied.title',
      USER_NOT_FOUND: 'errors.account.not_found.title',
      ACCOUNT_NOT_FOUND: 'errors.account.not_found.title',
      ROOM_NOT_FOUND: 'errors.room.not_found.title',
      ROOM_LIMIT_REACHED: 'errors.room.limited.title',
      DOCUMENT_NOT_FOUND: 'errors.document.not_found.title',
      FLASHCARD_NOT_FOUND: 'errors.flashcard.not_found.title',
      QUIZ_NOT_FOUND: 'errors.quiz.not_found.title',
      PROCESSING_FAILED: 'errors.document.processing_failed.title',
      AI_GENERATION_FAILED: 'errors.flashcard.generation_failed.title',
      UPLOAD_FAILED: 'errors.document.upload_failed.title',
      PAYMENT_FAILED: 'errors.payment.failed.title',
      SUBSCRIPTION_EXPIRED: 'errors.payment.subscription_expired.title',
      INTERNAL_ERROR: 'errors.network.server_error.title',
      DATABASE_ERROR: 'errors.network.server_error.title',
      EXTERNAL_API_ERROR: 'errors.network.connection_failed.title',
      INVALID_INPUT: 'errors.validation.invalid_email.title',
      REQUIRED_FIELD: 'errors.validation.required_field.title',
      FILE_TOO_LARGE: 'errors.validation.file_too_large.title',
      INVALID_FILE_TYPE: 'errors.validation.invalid_file_type.title',
    }

    const translationKey = titleMapping[errorType]
    if (translationKey) {
      return t(translationKey)
    }

    return t('errors.generic.unexpected_error.title')
  }, [t])

  return {
    error,
    handleError,
    clearError,
    getErrorMessage,
    getErrorTitle,
  }
}
