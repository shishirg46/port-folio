import type { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/next'
import Sidebar from '@/components/Layout/Sidebar'
import Footer from '@/components/Layout/Footer'
import { ContentProvider } from '@/lib/content-provider'
import './globals.css'

export const metadata = {
  title: 'Shishir Ghimire | Portfolio',
  description:
    'Web Developer from Biratnagar, Nepal building React, Next.js, Node.js, and database-backed applications.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <ContentProvider>
          <Sidebar />
          <div className="md:ml-72 min-h-screen pt-14 md:pt-0">
            {children}
            <Footer />
          </div>
        </ContentProvider>
        <Analytics />
      </body>
    </html>
  )
}
