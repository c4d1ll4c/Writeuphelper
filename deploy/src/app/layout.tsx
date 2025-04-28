import type { Metadata } from 'next/types'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Toolbox - Task List Generator',
  description: 'Generate organized task lists for production artists',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b bg-card">
            <div className="container mx-auto py-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent">The Toolbox</h1>
            </div>
          </header>
          <main className="flex-1 container mx-auto py-6 px-4">
            {children}
          </main>
          <footer className="border-t py-4 bg-card">
            <div className="container mx-auto text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} The Toolbox. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
} 