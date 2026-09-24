
import Navbar from "@/components/ui/navbar"
import Footer from "@/components/ui/footer"
import { I18nProvider } from "@/components/providers/i18n-provider"
import { ReferralProvider } from "@/components/providers/referral-provider"
import { CustomAlertProvider } from "@/hooks/use-custom-alerts"
import { ThemeProvider } from "@/hooks/use-theme"
import { ClerkProvider } from "@clerk/nextjs"
import { MathJaxContext } from "better-react-mathjax"
import { Inter } from "next/font/google"
import { getSEOConfigByPath, generateWebApplicationStructuredData, generateOrganizationStructuredData, generateWebsiteStructuredData } from "@/lib/seo"
import { headers } from "next/headers"
import type React from "react"
import "./globals.css"
import '../styles/globals-styles.css'

const inter = Inter({ subsets: ["latin"] })


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get current pathname and search params from headers
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/'
  const searchParamsString = headersList.get('x-search-params') || ''
  
  // Parse search params
  const searchParams: Record<string, string | undefined> = {}
  if (searchParamsString) {
    const urlSearchParams = new URLSearchParams(searchParamsString)
    for (const [key, value] of urlSearchParams) {
      searchParams[key] = value
    }
  }
  
  // Get SEO configuration for current page
  const currentSEO = getSEOConfigByPath(pathname, searchParams)
  
  // Generate structured data
  const appStructuredData = generateWebApplicationStructuredData()
  const organizationStructuredData = generateOrganizationStructuredData()
  const websiteStructuredData = generateWebsiteStructuredData()
  

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Basic Meta Tags */}
          <title>{currentSEO.title}</title>
          <meta name="description" content={currentSEO.description} />
          <meta name="keywords" content={currentSEO.keywords?.join(', ')} />
          <link rel="icon" href="/logo.svg" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#ffffff" />
          
          {/* Robots meta - conditional based on noIndex */}
          <meta name="robots" content={currentSEO.noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
          <meta name="googlebot" content={currentSEO.noIndex ? "noindex, nofollow" : "index, follow"} />
          <meta name="bingbot" content={currentSEO.noIndex ? "noindex, nofollow" : "index, follow"} />
          
          {/* Canonical URL */}
          <link rel="canonical" href={`https://nootiq.app${currentSEO.url || pathname}`} />
          
          {/* Open Graph / Facebook */}
          <meta property="og:title" content={currentSEO.title} />
          <meta property="og:description" content={currentSEO.description} />
          <meta property="og:image" content={currentSEO.image || '/logo.svg'} />
          <meta property="og:url" content={`https://nootiq.app${currentSEO.url || pathname}`} />
          <meta property="og:type" content={currentSEO.type || 'website'} />
          <meta property="og:site_name" content="Nootiq" />
          <meta property="og:locale" content="en_US" />
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={currentSEO.title} />
          <meta name="twitter:description" content={currentSEO.description} />
          <meta name="twitter:image" content={currentSEO.image || '/logo.svg'} />
          <meta name="twitter:creator" content="@nootiq" />
          <meta name="twitter:site" content="@nootiq" />
          
          {/* Icons and Manifest */}
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/svg+xml" href="/logo.svg" />
          <link rel="manifest" href="/site.webmanifest" />
          
          {/* Preconnect to external domains for performance */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
          
          {/* Additional meta tags for better SEO */}
          <meta name="author" content="Nootiq" />
          <meta name="publisher" content="Nootiq" />
          <meta name="application-name" content="Nootiq" />
          <meta name="msapplication-TileColor" content="#6366f1" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          
          {/* Structured Data - only for pages that should be indexed */}
          {!currentSEO.noIndex && (
            <>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(appStructuredData),
                }}
              />
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(organizationStructuredData),
                }}
              />
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(websiteStructuredData),
                }}
              />
              {/* Include page-specific structured data if available */}
              {currentSEO.structuredData && (
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify(currentSEO.structuredData),
                  }}
                />
              )}
            </>
          )}
        </head>
        <body className={inter.className}>
          <ThemeProvider>
            <I18nProvider>
              <CustomAlertProvider>
                <ReferralProvider>
                  <div className="min-h-screen flex flex-col bg-primary text-secondary scrollbar-accent">
                    <Navbar />
                    <MathJaxContext> <main className="">{children}</main></MathJaxContext>

                  </div>
                </ReferralProvider>
              </CustomAlertProvider>
            </I18nProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
