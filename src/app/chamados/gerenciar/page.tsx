'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PageContainer from '@/components/PageContainer';
import TicketManagement from '@/components/TicketManagement';

export default function GerenciarChamadosPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    // Verificar se o usuário tem permissão para acessar esta página
    if (!loading && user && user.role === 'colaborador') {
      router.push('/chamados');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-800"></div>
        </div>
      </PageContainer>
    );
  }

  if (!user || user.role === 'colaborador') {
    return null;
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-zinc-800">Gerenciar Chamados</h1>
        </div>
        
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm">
          <TicketManagement />
        </div>
      </div>
    </PageContainer>
  );
} 