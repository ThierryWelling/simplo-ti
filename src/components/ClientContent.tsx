'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Providers } from '@/providers/providers';
import AnimatedGrid from '@/components/AnimatedGrid';
import EmailConfirmationAlert from '@/components/EmailConfirmationAlert';

interface ClientContentProps {
  children: ReactNode;
}

export default function ClientContent({ children }: ClientContentProps) {
  return (
    <AuthProvider>
      <EmailConfirmationAlert />
      <Providers>
        <AnimatedGrid />
        <div className="min-h-screen">
          {children}
        </div>
      </Providers>
    </AuthProvider>
  );
} 