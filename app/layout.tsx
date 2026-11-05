import type { Metadata } from 'next'
import { Archivo, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-sans'
});

// Display font for the homepage headlines. Archivo is a variable font with a
// width axis, so loading 'wdth' lets CSS squeeze it to the condensed, heavy
// look in the mockup (see .type-display in globals.css).
const archivo = Archivo({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["wdth"],
  variable: '--font-archivo'
});

export const metadata: Metadata = {
  title: 'SoloSaathi - Find Your Trek Companion',
  description: 'Pre-trip compatibility matching for self-organised solo trekkers. Friends on rent, not co-travellers.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} ${archivo.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
