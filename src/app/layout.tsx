import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ClientProviders } from '@/components/client-providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://shyptsolution.com';

const primaryTitle = 'Shypt Solution | Indie Software Studio by Raunit Verma';
const primaryDescription =
  'Discover Shypt Solution by Raunit Verma—indie software products, developer tools, and cross-platform experiences trusted by 50k+ users worldwide.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: primaryTitle,
    template: '%s | Shypt Solution',
  },
  description: primaryDescription,
  keywords: [
    'Shypt Solution',
    'Raunit Verma',
    'Shypt Solution projects',
    'Raunit Verma software',
    'indie software studio',
    'developer tools',
    'SaaS products',
    'web apps',
    'mobile apps',
  ],
  authors: [{ name: 'Raunit Verma' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: primaryTitle,
    description: primaryDescription,
    url: siteUrl,
    siteName: 'Shypt Solution',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Shypt Solution | Indie Software Projects by Raunit Verma',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: primaryTitle,
    description: primaryDescription,
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Shypt Solution',
  alternateName: 'Raunit Verma',
  url: siteUrl,
  description: primaryDescription,
  founder: {
    '@type': 'Person',
    name: 'Raunit Verma',
    url: 'https://raunit.dev',
    jobTitle: 'Indie Software Developer',
  },
  sameAs: [
    'https://www.linkedin.com/in/iraunit',
    'https://github.com/iraunit',
    'https://x.com/iraunit',
  ],
  brand: {
    '@type': 'Brand',
    name: 'Shypt Solution',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
