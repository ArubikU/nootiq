import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://nootiq.app'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/rooms',
          '/rooms/*',
          '/documents',
          '/documents/*',
          '/summaries',
          '/summaries/*',
          '/payment-success',
          '/api/*',
          '/_next/*',
          '/admin/*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/rooms',
          '/rooms/*',
          '/documents',
          '/documents/*',
          '/summaries',
          '/summaries/*',
          '/payment-success',
          '/api/*',
          '/_next/*',
          '/admin/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
