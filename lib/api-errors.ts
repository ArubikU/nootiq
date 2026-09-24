import { NextResponse } from 'next/server'

export interface ApiError {
  code: string
  messageKey: string
  statusCode: number
  details?: any
}

export const API_ERRORS = {
  // Authentication errors
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    messageKey: 'errors.account.unauthorized.message',
    statusCode: 401,
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    messageKey: 'errors.account.access_denied.message',
    statusCode: 403,
  },
  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRED',
    messageKey: 'errors.account.unauthorized.message',
    statusCode: 401,
  },

  // User errors
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    messageKey: 'errors.account.not_found.message',
    statusCode: 404,
  },
  ACCOUNT_NOT_FOUND: {
    code: 'ACCOUNT_NOT_FOUND',
    messageKey: 'errors.account.not_found.message',
    statusCode: 404,
  },

  // Resource errors
  ROOM_NOT_FOUND: {
    code: 'ROOM_NOT_FOUND',
    messageKey: 'errors.room.not_found.message',
    statusCode: 404,
  },
  DOCUMENT_NOT_FOUND: {
    code: 'DOCUMENT_NOT_FOUND',
    messageKey: 'errors.document.not_found.message',
    statusCode: 404,
  },
  FLASHCARD_NOT_FOUND: {
    code: 'FLASHCARD_NOT_FOUND',
    messageKey: 'errors.flashcard.not_found.message',
    statusCode: 404,
  },
  QUIZ_NOT_FOUND: {
    code: 'QUIZ_NOT_FOUND',
    messageKey: 'errors.quiz.not_found.message',
    statusCode: 404,
  },

  // Validation errors
  INVALID_INPUT: {
    code: 'INVALID_INPUT',
    messageKey: 'errors.validation.invalid_email.message',
    statusCode: 400,
  },
  REQUIRED_FIELD: {
    code: 'REQUIRED_FIELD',
    messageKey: 'errors.validation.required_field.message',
    statusCode: 400,
  },
  INVALID_EMAIL: {
    code: 'INVALID_EMAIL',
    messageKey: 'errors.validation.invalid_email.message',
    statusCode: 400,
  },
  FILE_TOO_LARGE: {
    code: 'FILE_TOO_LARGE',
    messageKey: 'errors.validation.file_too_large.message',
    statusCode: 400,
  },
  INVALID_FILE_TYPE: {
    code: 'INVALID_FILE_TYPE',
    messageKey: 'errors.validation.invalid_file_type.message',
    statusCode: 400,
  },

  // Limit errors
  LIMIT_REACHED: {
    code: 'LIMIT_REACHED',
    messageKey: 'errors.room.limited.message',
    statusCode: 429,
  },
  ROOM_LIMIT_REACHED: {
    code: 'ROOM_LIMIT_REACHED',
    messageKey: 'errors.room.limited.message',
    statusCode: 429,
  },
  AI_LIMIT_REACHED: {
    code: 'AI_LIMIT_REACHED',
    messageKey: 'errors.flashcard.generation_failed.message',
    statusCode: 429,
  },
  STORAGE_LIMIT_REACHED: {
    code: 'STORAGE_LIMIT_REACHED',
    messageKey: 'errors.document.upload_failed.message',
    statusCode: 429,
  },

  // Processing errors
  PROCESSING_FAILED: {
    code: 'PROCESSING_FAILED',
    messageKey: 'errors.document.processing_failed.message',
    statusCode: 422,
  },
  AI_GENERATION_FAILED: {
    code: 'AI_GENERATION_FAILED',
    messageKey: 'errors.flashcard.generation_failed.message',
    statusCode: 422,
  },
  UPLOAD_FAILED: {
    code: 'UPLOAD_FAILED',
    messageKey: 'errors.document.upload_failed.message',
    statusCode: 422,
  },

  // Payment errors
  PAYMENT_FAILED: {
    code: 'PAYMENT_FAILED',
    messageKey: 'errors.payment.failed.message',
    statusCode: 402,
  },
  SUBSCRIPTION_EXPIRED: {
    code: 'SUBSCRIPTION_EXPIRED',
    messageKey: 'errors.payment.subscription_expired.message',
    statusCode: 402,
  },

  // Server errors
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    messageKey: 'errors.network.server_error.message',
    statusCode: 500,
  },
  DATABASE_ERROR: {
    code: 'DATABASE_ERROR',
    messageKey: 'errors.network.server_error.message',
    statusCode: 500,
  },
  EXTERNAL_API_ERROR: {
    code: 'EXTERNAL_API_ERROR',
    messageKey: 'errors.network.connection_failed.message',
    statusCode: 502,
  },
} as const

export function createApiError(
  errorType: keyof typeof API_ERRORS,
  details?: any,
  customMessage?: string,
  data= {}
): NextResponse {
  const error = API_ERRORS[errorType]
  
  return NextResponse.json(
    {
    ...data,
      error: {
        code: error.code,
        messageKey: error.messageKey,
        message: customMessage, // Para compatibilidad temporal
        details: details || undefined,
      },
    },
    { status: error.statusCode }
  )
}

export function createSuccessResponse(data: any, message?: string): NextResponse {
  return NextResponse.json({
    ...data,
    success: true,
    message,
  })
}

export function handleApiError(error: any): NextResponse {
  console.error('API Error:', error)
  
  // Si es un error conocido, retornarlo
  if (error.code && API_ERRORS[error.code as keyof typeof API_ERRORS]) {
    return createApiError(error.code as keyof typeof API_ERRORS, error.details)
  }
  
  // Error genérico
  return createApiError('INTERNAL_ERROR', {
    originalError: error.message || 'Unknown error',
  })
}

export function getMessageKey(data: any): string | undefined {
  if (data && data.error && data.error.messageKey) {
    return data.error.messageKey
  }
  return "errors.generic.unexpected_error.message"
}

export function hasError(data: any): boolean {
  return data && data.error !== undefined
}

export function getErrorDetails(data: any): any | undefined {
  if (data && data.error && data.error.details) {
    return data.error.details
  }
  return undefined
}
export type ApiErrorType = keyof typeof API_ERRORS
