'use client';

import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import GridBackground from '@/components/GridBackground';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Simplo TI',
  description: 'Sistema de Gerenciamento de TI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <Toaster position="top-right" />
          <GridBackground />
          {isAuthPage ? (
            children
          ) : (
            <div className="flex min-h-screen">
              <Sidebar onToggle={setIsSidebarOpen} />
              <main 
                className={`flex-1 transition-all duration-300 ${
                  isSidebarOpen ? 'ml-64' : 'ml-16'
                }`}
              >
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  {children}
                </div>
              </main>
            </div>
          )}
        </AuthProvider>
      </body>
    </html>
  )
} 