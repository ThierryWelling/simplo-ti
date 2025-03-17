import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Simplo TI',
  description: 'Sistema de Gerenciamento de TI',
}

import RootClient from './root-client'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <RootClient>{children}</RootClient>
      </body>
    </html>
  )
} 