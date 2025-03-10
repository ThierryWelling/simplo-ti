'use client';

import { useState, useEffect } from 'react';
import { FiUsers, FiClipboard, FiCheckCircle, FiAlertCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';
import GlassmorphismContainer from './GlassmorphismContainer';

interface DashboardStats {
  totalUsers: number;
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  completedTickets: number;
  highPriorityTickets: number;
}

const initialStats: DashboardStats = {
  totalUsers: 0,
  totalTickets: 0,
  openTickets: 0,
  inProgressTickets: 0,
  completedTickets: 0,
  highPriorityTickets: 0
};

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      fetchStats();
    }
    return () => {
      setMounted(false);
    };
  }, []);

  const fetchStats = async () => {
    if (!mounted) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Buscar total de usuários
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (usersError) throw usersError;

      // Buscar total de chamados
      const { count: totalTickets, error: ticketsError } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true });
      
      if (ticketsError) throw ticketsError;

      // Buscar chamados abertos
      const { count: openTickets, error: openError } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'aberto');
      
      if (openError) throw openError;

      // Buscar chamados em andamento
      const { count: inProgressTickets, error: inProgressError } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'em_andamento');
      
      if (inProgressError) throw inProgressError;

      // Buscar chamados concluídos
      const { count: completedTickets, error: completedError } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'concluido');
      
      if (completedError) throw completedError;

      // Buscar chamados de alta prioridade
      const { count: highPriorityTickets, error: priorityError } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .in('priority', ['alta', 'urgente']);
      
      if (priorityError) throw priorityError;

      if (mounted) {
        setStats({
          totalUsers: totalUsers || 0,
          totalTickets: totalTickets || 0,
          openTickets: openTickets || 0,
          inProgressTickets: inProgressTickets || 0,
          completedTickets: completedTickets || 0,
          highPriorityTickets: highPriorityTickets || 0
        });
      }
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
      if (mounted) {
        setError(error.message || 'Erro ao carregar estatísticas');
      }
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  };

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <GlassmorphismContainer className="p-6">
        <div className="text-red-600">
          <p className="font-bold">Erro</p>
          <p>{error}</p>
        </div>
      </GlassmorphismContainer>
    );
  }

  return (
    <>
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <GlassmorphismContainer className="p-4">
          <div className="flex items-center">
            <div className="rounded-xl bg-blue-100 p-3 mr-4">
              <FiUsers className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Total de Usuários</p>
              <p className="text-2xl font-semibold text-zinc-800">{stats.totalUsers}</p>
            </div>
          </div>
        </GlassmorphismContainer>

        <GlassmorphismContainer className="p-4">
          <div className="flex items-center">
            <div className="rounded-xl bg-purple-100 p-3 mr-4">
              <FiClipboard className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Total de Chamados</p>
              <p className="text-2xl font-semibold text-zinc-800">{stats.totalTickets}</p>
            </div>
          </div>
        </GlassmorphismContainer>

        <GlassmorphismContainer className="p-4">
          <div className="flex items-center">
            <div className="rounded-xl bg-yellow-100 p-3 mr-4">
              <FiClock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Chamados Abertos</p>
              <p className="text-2xl font-semibold text-zinc-800">{stats.openTickets}</p>
            </div>
          </div>
        </GlassmorphismContainer>

        <GlassmorphismContainer className="p-4">
          <div className="flex items-center">
            <div className="rounded-xl bg-indigo-100 p-3 mr-4">
              <FiTrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Em Andamento</p>
              <p className="text-2xl font-semibold text-zinc-800">{stats.inProgressTickets}</p>
            </div>
          </div>
        </GlassmorphismContainer>

        <GlassmorphismContainer className="p-4">
          <div className="flex items-center">
            <div className="rounded-xl bg-green-100 p-3 mr-4">
              <FiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Chamados Concluídos</p>
              <p className="text-2xl font-semibold text-zinc-800">{stats.completedTickets}</p>
            </div>
          </div>
        </GlassmorphismContainer>

        <GlassmorphismContainer className="p-4">
          <div className="flex items-center">
            <div className="rounded-xl bg-red-100 p-3 mr-4">
              <FiAlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Alta Prioridade</p>
              <p className="text-2xl font-semibold text-zinc-800">{stats.highPriorityTickets}</p>
            </div>
          </div>
        </GlassmorphismContainer>
      </div>

      {/* Gráfico de status dos chamados */}
      <GlassmorphismContainer className="p-6">
        <h2 className="text-lg font-semibold text-zinc-800 mb-4">Status dos Chamados</h2>
        <div className="h-8 bg-zinc-200 rounded-xl overflow-hidden">
          {stats.totalTickets > 0 && (
            <>
              <div 
                className="h-full bg-yellow-500 float-left transition-all" 
                style={{ width: `${(stats.openTickets / stats.totalTickets) * 100}%` }}
                title={`Abertos: ${stats.openTickets}`}
              ></div>
              <div 
                className="h-full bg-indigo-500 float-left transition-all" 
                style={{ width: `${(stats.inProgressTickets / stats.totalTickets) * 100}%` }}
                title={`Em Andamento: ${stats.inProgressTickets}`}
              ></div>
              <div 
                className="h-full bg-green-500 float-left transition-all" 
                style={{ width: `${(stats.completedTickets / stats.totalTickets) * 100}%` }}
                title={`Concluídos: ${stats.completedTickets}`}
              ></div>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-4 justify-between mt-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span>Abertos ({stats.openTickets})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
            <span>Em Andamento ({stats.inProgressTickets})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Concluídos ({stats.completedTickets})</span>
          </div>
        </div>
      </GlassmorphismContainer>
    </>
  );
} 