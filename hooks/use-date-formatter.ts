import { useTranslation } from 'react-i18next'

export type DateFormat = 'full' | 'short' | 'medium' | 'long'

export const useDateFormatter = () => {
  const { t, i18n } = useTranslation()

  const formatDate = (
    date: Date | string,
    format: DateFormat = 'full'
  ): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (!dateObj || isNaN(dateObj.getTime())) {
      return ''
    }

    const day = dateObj.getDate()
    const monthIndex = dateObj.getMonth()
    const year = dateObj.getFullYear()
    const dayOfWeek = dateObj.getDay()

    // Month names mapping
    const monthKeys = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ]

    const monthShortKeys = [
      'jan', 'feb', 'mar', 'apr', 'may', 'jun',
      'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
    ]

    // Day names mapping (Sunday = 0)
    const dayKeys = [
      'sunday', 'monday', 'tuesday', 'wednesday', 
      'thursday', 'friday', 'saturday'
    ]

    const dayShortKeys = [
      'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'
    ]

    // Get translated values
    const monthName = t(`date.months.${monthKeys[monthIndex]}`)
    const monthShort = t(`date.months_short.${monthShortKeys[monthIndex]}`)
    const dayName = t(`date.days.${dayKeys[dayOfWeek]}`)
    const dayShort = t(`date.days_short.${dayShortKeys[dayOfWeek]}`)

    // Get format template
    const formatTemplate = t(`date.formats.${format}`)

    // Replace placeholders
    return formatTemplate
      .replace('{{day}}', day.toString())
      .replace('{{month}}', monthName)
      .replace('{{monthShort}}', monthShort)
      .replace('{{monthNumber}}', (monthIndex + 1).toString().padStart(2, '0'))
      .replace('{{year}}', year.toString())
      .replace('{{dayName}}', dayName)
      .replace('{{dayShort}}', dayShort)
  }

  const formatDateString = (
    dateString: string,
    format: DateFormat = 'full'
  ): string => {
    // Handle common date formats
    const date = new Date(dateString)
    return formatDate(date, format)
  }

  // Helper function to format specific dates
  const formatSpecificDate = (
    day: number,
    month: number,
    year: number,
    format: DateFormat = 'full'
  ): string => {
    const date = new Date(year, month - 1, day) // month is 0-indexed
    return formatDate(date, format)
  }

  return {
    formatDate,
    formatDateString,
    formatSpecificDate,
    currentLanguage: i18n.language
  }
}

// Hook for getting current date in different formats
export const useCurrentDate = () => {
  const { formatDate } = useDateFormatter()
  const now = new Date()

  return {
    full: formatDate(now, 'full'),
    short: formatDate(now, 'short'),
    medium: formatDate(now, 'medium'),
    long: formatDate(now, 'long')
  }
}
