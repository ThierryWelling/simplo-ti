'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PageContainer from '@/components/PageContainer';
import TicketList from '@/components/TicketList';
import GlassmorphismContainer from '@/components/GlassmorphismContainer';
import { FiPlus } from 'react-icons/fi';
import Link from 'next/link';

export default function ChamadosPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'colaborador') {
        router.push('/chamados/gerenciar');
      }
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

  if (!user || user.role !== 'colaborador') {
    return null;
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-zinc-800">Meus Chamados</h1>
          <Link
            href="/chamados/novo"
            className="px-4 py-2 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors flex items-center gap-2 text-sm"
          >
            <FiPlus size={18} />
            <span>Novo Chamado</span>
          </Link>
        </div>
        
        <GlassmorphismContainer>
          <TicketList />
        </GlassmorphismContainer>
      </div>
    </PageContainer>
  );
} 