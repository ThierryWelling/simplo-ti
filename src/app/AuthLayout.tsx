"use client";

import RedirectIfAuthenticated from '@/components/RedirectIfAuthenticated';
import { Inter } from 'next/font/google';
import GridBackground from '@/components/GridBackground';

const inter = Inter({ subsets: ['latin'] });

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RedirectIfAuthenticated>
      <div className="min-h-screen flex items-center justify-center">
        {children}
      </div>
    </RedirectIfAuthenticated>
  );
} 