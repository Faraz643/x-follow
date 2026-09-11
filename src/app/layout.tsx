import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'X Follow — Discover people worth following',
  description: 'Follow for follow. Discover X accounts by category and connect with people in the same space.',
  openGraph: {
    title: 'X Follow — Follow for follow. Same category, real connections.',
    description: 'Discover X accounts by category and connect with people in the same space.',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'X Follow — Follow for follow. Same category, real connections.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'X Follow — Follow for follow. Same category, real connections.',
    description: 'Discover X accounts by category and connect with people in the same space.',
    images: ['/opengraph-image'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
