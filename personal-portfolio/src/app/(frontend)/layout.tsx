import { Geist, Merriweather, IBM_Plex_Sans } from 'next/font/google'
import { ThemeProvider } from '@/providers/Theme'
import { InitTheme } from '@/providers/Theme/InitTheme'
import './globals.css'

import type { Metadata } from 'next'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-merriweather',
  display: 'swap',
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibmPlexSans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Pruthvish Modi | Portfolio',
    template: '%s | Pruthvish Modi',
  },
  description: 'Portfolio of Pruthvish Modi - Senior Full-Stack Developer & AI-First Engineer',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', sizes: 'any' },
    ],
    shortcut: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  metadataBase: new URL('http://localhost:3000'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={`${geist.variable} ${merriweather.variable} ${ibmPlexSans.variable} antialiased`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        {/* Favicon */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/icon.svg" type="image/svg+xml" />
        {/* Load Material Symbols for portfolio stack icons */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        {/* Devicon – colored technology brand icons */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/devicon.min.css" />
      </head>
      <body>
        <ThemeProvider>
          {/* Note: Header & Footer are intentionally omitted here to build a clean portfolio container */}
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
