import { Metadata } from 'next'

// ==================== INTERFACES ====================

export interface SEOConfig {
  title?: string
  description?: string
  keywords?: readonly string[] | string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  structuredData?: object | object[]
}

export interface BreadcrumbItem {
  name: string
  url: string
}

// ==================== CONSTANTS ====================

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://nootiq.app' 
  : 'http://localhost:3000'

const DEFAULT_SEO: Readonly<SEOConfig> = {
  title: 'Nootiq - Transform documents into study material',
  description: 'Educational platform that uses AI to convert documents into study material. Create flashcards, quizzes and summaries automatically.',
  keywords: ['education', 'AI', 'study', 'flashcards', 'quizzes', 'documents', 'learning'],
  image: '/logo.svg',
  type: 'website'
} as const

// ==================== STRUCTURED DATA GENERATORS ====================

export function generateWebApplicationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Nootiq',
    url: BASE_URL,
    description: DEFAULT_SEO.description,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      category: 'Free'
    },
    author: {
      '@type': 'Organization',
      name: 'Nootiq',
      url: BASE_URL
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    image: '/logo.svg',
    softwareVersion: '1.0.0',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
      bestRating: '5',
      worstRating: '1'
    },
    featureList: [
      'AI-powered document analysis',
      'Automatic flashcard generation',
      'Quiz creation from documents',
      'Document summarization',
      'Study room organization',
      'Multi-format document support'
    ]
  }
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nootiq',
    url: BASE_URL,
    logo: '/logo.svg',
    description: 'Educational platform that uses AI to convert documents into study material.',
    foundingDate: '2024',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      url: '/contact'
    }
  }
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Nootiq',
    url: BASE_URL,
    description: 'Transform documents into study material with AI',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

// Helper to combine structured data
const combineStructuredData = (...objects: object[]): object[] => objects.filter(Boolean)

// ==================== SEO CONFIGURATIONS ====================

// Common structured data for organization pages
const ORGANIZATION_DATA = () => generateOrganizationStructuredData()

// Full structured data for home page
const HOME_STRUCTURED_DATA = () => combineStructuredData(
  generateWebApplicationStructuredData(),
  generateOrganizationStructuredData(),
  generateWebsiteStructuredData()
)

export const seoConfigs = {
  home: {
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    keywords: DEFAULT_SEO.keywords,
    image: '/logo.svg',
    type: 'website' as const,
    url: '/',
    structuredData: HOME_STRUCTURED_DATA(),
  },

  register: {
    title: 'Sign Up - Nootiq',
    description: 'Join Nootiq and start transforming your documents into study material with artificial intelligence.',
    keywords: ['sign up', 'create account', 'nootiq', 'education', 'AI'],
    image: '/logo.svg',
    type: 'website' as const,
    url: '/register',
    structuredData: ORGANIZATION_DATA(),
  },

  registerWithReferral: (referralCode: string): SEOConfig => ({
    title: `Sign Up with referral code ${referralCode} - Nootiq`,
    description: `Join Nootiq with referral code ${referralCode} and get special benefits. Transform documents into study material with AI.`,
    keywords: ['sign up', 'referral', 'code', 'nootiq', 'education', 'AI', 'benefits'],
    image: '/logo.svg',
    type: 'website',
    url: `/register?ref=${referralCode}`,
    structuredData: ORGANIZATION_DATA(),
  }),

  login: {
    title: 'Sign In - Nootiq',
    description: 'Access your Nootiq account and continue transforming documents into study material.',
    keywords: ['login', 'sign in', 'access', 'nootiq'],
    image: '/logo.svg',
    type: 'website' as const,
    url: '/login',
    structuredData: ORGANIZATION_DATA(),
  },

  pricing: {
    title: 'Plans and Pricing - Nootiq',
    description: 'Discover Nootiq plans and choose the one that best fits your study needs. Free and premium plans available.',
    keywords: ['pricing', 'plans', 'premium', 'free', 'subscription', 'nootiq'],
    image: '/logo.svg',
    type: 'website' as const,
    url: '/pricing',
    structuredData: ORGANIZATION_DATA(),
  },

  promo: {
    title: 'Promotional Codes - Nootiq',
    description: 'Redeem promotional codes on Nootiq and get access to premium features for free.',
    keywords: ['promotion', 'promotional code', 'discount', 'premium', 'nootiq'],
    image: '/logo.svg',
    type: 'website' as const,
    url: '/promo',
    structuredData: ORGANIZATION_DATA(),
  },

  promoWithCode: (promoCode: string): SEOConfig => ({
    title: `Promotional Code ${promoCode} - Nootiq`,
    description: `Redeem promotional code ${promoCode} on Nootiq and get access to premium features. Transform documents into study material with AI.`,
    keywords: ['promotion', 'promotional code', promoCode, 'discount', 'premium', 'nootiq'],
    image: '/logo.svg',
    type: 'website',
    url: `/promo?code=${promoCode}`,
    structuredData: ORGANIZATION_DATA(),
  }),

  // Private pages (no structured data)
  dashboard: {
    title: 'Dashboard - Nootiq',
    description: 'Your main panel on Nootiq. Manage your study rooms, documents and generated material.',
    keywords: ['dashboard', 'panel', 'rooms', 'management', 'nootiq'],
    image: '/logo.svg',
    type: 'website' as const,
    url: '/dashboard',
    noIndex: true,
  },

  rooms: {
    title: 'Study Rooms - Nootiq',
    description: 'Explore and manage your study rooms on Nootiq. Organize your educational material by topics.',
    keywords: ['rooms', 'study', 'organization', 'topics', 'nootiq'],
    image: '/logo.svg',
    type: 'website' as const,
    url: '/rooms',
    noIndex: true,
  },

  documents: {
    title: 'Documents - Nootiq',
    description: 'Manage your documents on Nootiq. Upload, organize and transform documents into study material.',
    keywords: ['documents', 'upload', 'management', 'files', 'nootiq'],
    image: '/logo.svg',
    type: 'website' as const,
    url: '/documents',
    noIndex: true,
  },

  paymentSuccess: {
    title: 'Payment Successful - Nootiq',
    description: 'Your payment has been processed successfully. Enjoy Nootiq premium features.',
    keywords: ['payment', 'successful', 'premium', 'subscription', 'nootiq'],
    image: '/logo.svg',
    type: 'website' as const,
    url: '/payment-success',
    noIndex: true,
  },

  // Public informational pages
  about: {
    title: 'About Nootiq',
    description: 'Learn more about Nootiq, the educational platform that uses artificial intelligence to transform documents into study material.',
    keywords: ['about us', 'about', 'team', 'mission', 'nootiq'],
    image: '/logo.svg',
    type: 'website' as const,
    url: '/about',
    structuredData: ORGANIZATION_DATA(),
  },

  contact: {
    title: 'Contact - Nootiq',
    description: 'Get in touch with the Nootiq team. We resolve your questions and suggestions about our educational platform.',
    keywords: ['contact', 'support', 'help', 'suggestions', 'nootiq'],
    image: '/logo.svg',
    type: 'website' as const,
    url: '/contact',
    structuredData: ORGANIZATION_DATA(),
  },

  privacy: {
    title: 'Privacy Policy - Nootiq',
    description: 'Read our privacy policy and learn how we protect your data on Nootiq.',
    keywords: ['privacy', 'policy', 'data', 'protection', 'nootiq'],
    image: '/logo.svg',
    type: 'website' as const,
    url: '/privacy',
    structuredData: ORGANIZATION_DATA(),
  },
} as const

// ==================== UTILITY FUNCTIONS ====================

export function getSEOConfigByPath(pathname: string, searchParams?: Record<string, string | undefined>): SEOConfig {
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '')
  
  switch (normalizedPath) {
    case '/':
      return seoConfigs.home
    case '/register':
      return searchParams?.ref ? seoConfigs.registerWithReferral(searchParams.ref) : seoConfigs.register
    case '/promo':
      return searchParams?.code ? seoConfigs.promoWithCode(searchParams.code) : seoConfigs.promo
    case '/login':
      return seoConfigs.login
    case '/pricing':
      return seoConfigs.pricing
    case '/dashboard':
      return seoConfigs.dashboard
    case '/rooms':
      return seoConfigs.rooms
    case '/documents':
      return seoConfigs.documents
    case '/about':
      return seoConfigs.about
    case '/contact':
      return seoConfigs.contact
    case '/privacy':
      return seoConfigs.privacy
    case '/payment-success':
      return seoConfigs.paymentSuccess
    default:
      // Dynamic routes
      if (normalizedPath.startsWith('/rooms/')) {
        return {
          title: 'Study Room - Nootiq',
          description: 'Manage your study room on Nootiq. Generate flashcards, quizzes and summaries from your documents.',
          keywords: ['rooms', 'study', 'flashcards', 'quizzes', 'nootiq'],
          image: '/logo.svg',
          type: 'website',
          url: normalizedPath,
          noIndex: true,
        }
      }
      if (normalizedPath.startsWith('/summaries/')) {
        return {
          title: 'Document Summary - Nootiq',
          description: 'View and interact with your AI-generated document summary on Nootiq.',
          keywords: ['summary', 'document', 'AI', 'study', 'nootiq'],
          image: '/logo.svg',
          type: 'article',
          url: normalizedPath,
          noIndex: true,
        }
      }
      // Fallback to home
      return seoConfigs.home
  }
}
