import type { Metadata } from 'next'
import { Inter, Cinzel } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' })

export const metadata: Metadata = {
  title: 'D&D AI Tavern',
  description: 'Play D&D with an AI Dungeon Master',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable,
        cinzel.variable
      )}>
        {children}
      </body>
    </html>
  )
}
