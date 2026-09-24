import { useTranslation as useI18nextTranslation } from 'react-i18next'

/**
 * Hook personalizado para traducciones que convierte automáticamente
 * las rutas del formato "namespace.key" al formato "namespace:namespace.key"
 * para mantener compatibilidad con la estructura original
 */
export function useTranslation(namespace?: string) {
  const { t: originalT, i18n, ready } = useI18nextTranslation()
  
  /**
   * Función que convierte las rutas de traducción automáticamente
   * @param key - La clave de traducción (ej: "navbar.about", "common.save")
   * @param options - Opciones de interpolación
   */
  const t = originalT
  return {
    t,
    i18n,
    ready,
    changeLanguage: i18n.changeLanguage,
    language: i18n.language,
  }
}
