import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Sri Lanka Fuel Pass - Official Application',
  description: 'Access the official Sri Lanka Fuel Pass application. Quick and secure way to manage fuel subsidies.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/favicon.png', media: '(prefers-color-scheme: light)' },
      { url: '/favicon.png', media: '(prefers-color-scheme: dark)' },
      { url: '/favicon.png', type: 'image/svg+xml' },
    ],
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Sri Lanka Fuel Pass - Official Application',
    description: 'Access the official Sri Lanka Fuel Pass application. Quick and secure way to manage fuel subsidies.',
    url: 'https://fuelpass.gov.lk',
    siteName: 'Sri Lanka Fuel Pass',
    images: [
      {
        url: '/favicon.png',
        width: 1200,
        height: 630,
        alt: 'Sri Lanka Fuel Pass',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sri Lanka Fuel Pass - Official Application',
    description: 'Access the official Sri Lanka Fuel Pass application. Quick and secure way to manage fuel subsidies.',
    images: ['/favicon.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}