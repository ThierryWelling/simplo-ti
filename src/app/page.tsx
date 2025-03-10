'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import RouteGuard from '@/components/RouteGuard';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/chamados');
      }
    } else {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <RouteGuard requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600 dark:text-gray-300">
          Redirecionando...
        </div>
      </div>
    </RouteGuard>
  );
} 