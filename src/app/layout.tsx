import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'X Follow — Discover people worth following', description: 'Discover X accounts curated by category.' }
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html> }
