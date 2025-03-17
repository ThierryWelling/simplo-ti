'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/AdminDashboard';
import AuxiliaryScoreBoard from '@/components/AuxiliaryScoreBoard';

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-800"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Painel Administrativo</h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Métricas e gráficos principais - ocupa 2/3 da tela em telas grandes */}
        <div className="xl:col-span-2">
          <AdminDashboard />
        </div>
        
        {/* Ranking de auxiliares - ocupa 1/3 da tela em telas grandes */}
        <div className="xl:col-span-1">
          <div className="sticky top-6">
            <AuxiliaryScoreBoard />
          </div>
        </div>
      </div>
    </div>
  );
} 