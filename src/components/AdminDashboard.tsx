'use client';

import { Suspense } from 'react';
import { FiUsers, FiClipboard, FiCheckCircle, FiAlertCircle, FiClock, FiTrendingUp, FiSettings } from 'react-icons/fi';
import GlassmorphismContainer from './GlassmorphismContainer';
import Link from 'next/link';
import DashboardStats from './DashboardStats';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <GlassmorphismContainer key={i} className="p-4">
                <div className="animate-pulse flex items-center">
                  <div className="rounded-xl bg-zinc-200 p-3 mr-4 w-12 h-12"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-zinc-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-zinc-200 rounded w-1/2"></div>
                  </div>
                </div>
              </GlassmorphismContainer>
            ))}
          </div>
        }
      >
        <DashboardStats />
      </Suspense>

      {/* Ações rápidas */}
      <GlassmorphismContainer className="p-6">
        <h2 className="text-lg font-semibold text-zinc-800 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/chamados/novo" className="block">
            <GlassmorphismContainer className="p-4 hover:bg-zinc-50 transition-colors">
              <div className="flex items-center">
                <div className="rounded-xl bg-purple-100 p-3 mr-4">
                  <FiClipboard className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-800">Novo Chamado</p>
                  <p className="text-xs text-zinc-500">Criar um novo chamado</p>
                </div>
              </div>
            </GlassmorphismContainer>
          </Link>

          <Link href="/usuarios" className="block">
            <GlassmorphismContainer className="p-4 hover:bg-zinc-50 transition-colors">
              <div className="flex items-center">
                <div className="rounded-xl bg-blue-100 p-3 mr-4">
                  <FiUsers className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-800">Usuários</p>
                  <p className="text-xs text-zinc-500">Gerenciar usuários</p>
                </div>
              </div>
            </GlassmorphismContainer>
          </Link>

          <Link href="/configuracoes" className="block">
            <GlassmorphismContainer className="p-4 hover:bg-zinc-50 transition-colors">
              <div className="flex items-center">
                <div className="rounded-xl bg-zinc-100 p-3 mr-4">
                  <FiSettings className="h-6 w-6 text-zinc-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-800">Configurações</p>
                  <p className="text-xs text-zinc-500">Ajustes do sistema</p>
                </div>
              </div>
            </GlassmorphismContainer>
          </Link>
        </div>
      </GlassmorphismContainer>
    </div>
  );
} 