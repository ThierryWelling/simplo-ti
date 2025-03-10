'use client';

import { useState, useEffect } from 'react';
import { FiFilter, FiSearch, FiEdit2, FiMessageSquare, FiUser } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { getTickets, type Ticket, assignTicket } from '@/lib/tickets';
import { getUserProfile } from '@/lib/users';
import Link from 'next/link';
import GlassmorphismContainer from './GlassmorphismContainer';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

interface TicketWithAssignee extends Ticket {
  assigneeName?: string;
}

export default function TicketManagement() {
  const [tickets, setTickets] = useState<TicketWithAssignee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const { user } = useAuth();

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, user?.id]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');
      let filters = {};
      
      // Aplicar filtro de status se não for 'todos'
      if (statusFilter !== 'todos') {
        filters = { status: statusFilter };
      }

      // Se for auxiliar, buscar apenas chamados atribuídos a ele ou não atribuídos
      if (user?.role === 'auxiliar' && user?.id) {
        filters = {
          ...filters,
          assigned_to: [user.id, null]
        };
      }

      const data = await getTickets(filters);
      
      // Buscar os nomes dos responsáveis
      const ticketsWithAssignees = await Promise.all(
        data.map(async (ticket) => {
          if (ticket.assigned_to) {
            try {
              const assignee = await getUserProfile(ticket.assigned_to);
              return {
                ...ticket,
                assigneeName: assignee?.name || 'Usuário não encontrado'
              };
            } catch (error) {
              console.error('Erro ao buscar nome do responsável:', error);
              return {
                ...ticket,
                assigneeName: 'Erro ao carregar nome'
              };
            }
          }
          return ticket;
        })
      );

      setTickets(ticketsWithAssignees);
    } catch (error: any) {
      console.error('Erro ao buscar chamados:', error);
      setError(error.message || 'Erro ao buscar chamados');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTicket = async (ticketId: string) => {
    try {
      if (!user) return;
      
      await assignTicket(ticketId, user.id);
      await fetchTickets(); // Recarregar os chamados após atribuição
    } catch (error: any) {
      setError(error.message || 'Erro ao atribuir chamado');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ticket.title.toLowerCase().includes(searchLower) ||
      ticket.id.toLowerCase().includes(searchLower) ||
      ticket.description.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100/50 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Barra de ferramentas */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar chamados..."
              className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-400 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          </div>
        </div>
        <div className="flex gap-4">
          <select
            className="px-4 py-2 border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-400 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="todos">Todos os Status</option>
            <option value="aberto">Em Aberto</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluido">Concluídos</option>
            <option value="cancelado">Cancelados</option>
          </select>
          <button
            className="px-4 py-2 border border-zinc-300 rounded-xl hover:bg-zinc-100 focus:outline-none text-sm"
            aria-label="Filtros avançados"
          >
            <FiFilter size={18} className="text-zinc-600" />
          </button>
        </div>
      </div>

      {/* Lista de chamados */}
      <div className="space-y-4">
        {loading ? (
          // Estado de carregamento
          [...Array(3)].map((_, i) => (
            <GlassmorphismContainer key={i} className="p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
                <div className="h-3 bg-zinc-200 rounded w-1/2"></div>
              </div>
            </GlassmorphismContainer>
          ))
        ) : filteredTickets.length === 0 ? (
          // Mensagem quando não há chamados
          <GlassmorphismContainer className="p-6 text-center">
            <p className="text-zinc-500">Nenhum chamado encontrado.</p>
          </GlassmorphismContainer>
        ) : (
          // Lista de chamados
          filteredTickets.map((ticket) => (
            <GlassmorphismContainer
              key={ticket.id}
              className="p-4 hover:bg-white/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-zinc-800">
                      {ticket.title}
                    </h3>
                    <StatusBadge status={ticket.status} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span>ID: {ticket.id.substring(0, 8)}</span>
                    <span>Criado em: {formatDate(ticket.created_at)}</span>
                    <PriorityBadge priority={ticket.priority} />
                    {ticket.assigneeName && (
                      <span className="flex items-center gap-1">
                        <FiUser size={14} />
                        Responsável: {ticket.assigneeName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {!ticket.assigned_to && (user?.role === 'auxiliar' || user?.role === 'admin') && (
                    <button
                      onClick={() => handleAssignTicket(ticket.id)}
                      className="px-3 py-1 text-sm bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                    >
                      Assumir
                    </button>
                  )}
                  <Link
                    href={`/chamados/${ticket.id}`}
                    className="p-2 text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors"
                  >
                    <FiMessageSquare size={20} />
                  </Link>
                  {(user?.role === 'admin' || (user?.role === 'auxiliar' && ticket.assigned_to === user.id)) && (
                    <button
                      className="p-2 text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors"
                      onClick={() => {/* Implementar edição */}}
                    >
                      <FiEdit2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </GlassmorphismContainer>
          ))
        )}
      </div>
    </div>
  );
} 