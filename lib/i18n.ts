import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend';

// Import Spanish translations
import esHome from '@/locales/es/home.json'
import esNavbar from '@/locales/es/navbar.json'
import esContact from '@/locales/es/contact.json'
import esPrivacy from '@/locales/es/privacy.json'
import esDate from '@/locales/es/date.json'
import esAbout from '@/locales/es/about.json'
import esLogin from '@/locales/es/login.json'
import esRegister from '@/locales/es/register.json'
import esReferral from '@/locales/es/referral.json'
import esNotfound from '@/locales/es/notfound.json'
import esClerk from '@/locales/es/clerk.json'
import esPromo from '@/locales/es/promo.json'
import esDashboard from '@/locales/es/dashboard.json'
import esDocuments from '@/locales/es/documents.json'
import esNotebooks from '@/locales/es/notebooks.json'
import esSummaries from '@/locales/es/summaries.json'
import esFlashcards from '@/locales/es/flashcards.json'
import esQuizzes from '@/locales/es/quizzes.json'
import esErrors from '@/locales/es/errors.json'
import esPricing from '@/locales/es/pricing.json'
import esPaymentSuccess from '@/locales/es/payment-success.json'
import esCommon from '@/locales/es/common.json'
import esRooms from '@/locales/es/rooms.json'
import esUi from '@/locales/es/ui.json'
import esSeo from '@/locales/es/seo.json'
import esUserSettings from '@/locales/es/user_settings.json'
import esApp from '@/locales/es/app.json'

// Import English translations
import enHome from '@/locales/en/home.json'
import enNavbar from '@/locales/en/navbar.json'
import enContact from '@/locales/en/contact.json'
import enPrivacy from '@/locales/en/privacy.json'
import enDate from '@/locales/en/date.json'
import enAbout from '@/locales/en/about.json'
import enLogin from '@/locales/en/login.json'
import enRegister from '@/locales/en/register.json'
import enReferral from '@/locales/en/referral.json'
import enNotfound from '@/locales/en/notfound.json'
import enClerk from '@/locales/en/clerk.json'
import enPromo from '@/locales/en/promo.json'
import enDashboard from '@/locales/en/dashboard.json'
import enDocuments from '@/locales/en/documents.json'
import enNotebooks from '@/locales/en/notebooks.json'
import enSummaries from '@/locales/en/summaries.json'
import enFlashcards from '@/locales/en/flashcards.json'
import enQuizzes from '@/locales/en/quizzes.json'
import enErrors from '@/locales/en/errors.json'
import enPricing from '@/locales/en/pricing.json'
import enPaymentSuccess from '@/locales/en/payment-success.json'
import enCommon from '@/locales/en/common.json'
import enRooms from '@/locales/en/rooms.json'
import enUi from '@/locales/en/ui.json'
import enSeo from '@/locales/en/seo.json'
import enUserSettings from '@/locales/en/user_settings.json'
import enApp from '@/locales/en/app.json'
const resources = {
  es: {
    translation: {
      common: esCommon,
      home: esHome,
      navbar: esNavbar,
      contact: esContact,
      privacy: esPrivacy,
      date: esDate,
      about: esAbout,
      login: esLogin,
      register: esRegister,
      referral: esReferral,
      notfound: esNotfound,
      clerk: esClerk,
      promo: esPromo,
      dashboard: esDashboard,
      documents: esDocuments,
      notebooks: esNotebooks,
      summaries: esSummaries,
      flashcards: esFlashcards,
      quizzes: esQuizzes,
      errors: esErrors,
      pricing: esPricing,
      paymentSuccess: esPaymentSuccess,
      rooms: esRooms,
      ui: esUi,
      seo: esSeo,
      userSettings: esUserSettings,
      app: esApp,
    }
  },
  en: {
    translation: {
      common: enCommon,
      home: enHome,
      navbar: enNavbar,
      contact: enContact,
      privacy: enPrivacy,
      date: enDate,
      about: enAbout,
      login: enLogin,
      register: enRegister,
      referral: enReferral,
      notfound: enNotfound,
      clerk: enClerk,
      promo: enPromo,
      dashboard: enDashboard,
      documents: enDocuments,
      notebooks: enNotebooks,
      summaries: enSummaries,
      flashcards: enFlashcards,
      quizzes: enQuizzes,
      errors: enErrors,
      pricing: enPricing,
      paymentSuccess: enPaymentSuccess,
      rooms: enRooms,
      ui: enUi,
      seo: enSeo,
      userSettings: enUserSettings,
      app: enApp,
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    load: 'languageOnly',
    debug: true,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    }
  })

export default i18n
