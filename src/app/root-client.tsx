'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import GridBackground from '@/components/GridBackground';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

export default function RootClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <GridBackground />
      {isAuthPage ? (
        children
      ) : (
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 relative bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-transparent">
              {children}
            </div>
          </main>
        </div>
      )}
    </AuthProvider>
  );
} 