'use client';

import { Suspense } from 'react';
import { FiUsers, FiClipboard, FiCheckCircle, FiAlertCircle, FiClock, FiTrendingUp, FiSettings } from 'react-icons/fi';
import GlassmorphismContainer from './GlassmorphismContainer';
import Link from 'next/link';
import DashboardStats from './DashboardStats';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
          </div>
        }
      >
        <DashboardStats />
      </Suspense>

      {/* Ações rápidas */}
      <GlassmorphismContainer className="p-6">
        <h2 className="text-lg font-semibold text-zinc-800 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/usuarios"
            className="bg-white/50 hover:bg-white/80 p-4 rounded-xl flex items-center transition-all"
          >
            <FiUsers className="h-5 w-5 text-blue-600 mr-3" />
            <span className="text-zinc-700">Gerenciar Usuários</span>
          </Link>
          <Link
            href="/chamados/gerenciar"
            className="bg-white/50 hover:bg-white/80 p-4 rounded-xl flex items-center transition-all"
          >
            <FiClipboard className="h-5 w-5 text-purple-600 mr-3" />
            <span className="text-zinc-700">Gerenciar Chamados</span>
          </Link>
          <Link
            href="/admin/configuracoes"
            className="bg-white/50 hover:bg-white/80 p-4 rounded-xl flex items-center transition-all"
          >
            <FiSettings className="h-5 w-5 text-zinc-600 mr-3" />
            <span className="text-zinc-700">Configurações</span>
          </Link>
        </div>
      </GlassmorphismContainer>
    </div>
  );
} 