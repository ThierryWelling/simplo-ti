'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTickets, type Ticket } from '@/lib/tickets';
import { getStatusBadgeClass, getStatusText, getPrioridadeBadgeClass } from '@/utils/helpers';
import GlassmorphismContainer from './GlassmorphismContainer';
import RatingModal from './RatingModal';

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const fetchTickets = async () => {
    if (!user) return;

    try {
      let filters = {};
      
      if (user.role === 'colaborador') {
        filters = { created_by: user.id };
      }
      
      const data = await getTickets(filters);
      setTickets(data);

      // Verificar se há chamados concluídos sem avaliação
      const unratedCompletedTicket = data.find(
        ticket => ticket.status === 'concluido' && 
        !ticket.rating && 
        ticket.created_by === user.id
      );

      if (unratedCompletedTicket) {
        setSelectedTicket(unratedCompletedTicket);
        setShowRatingModal(true);
      }
    } catch (error: any) {
      setError(error.message || 'Erro ao buscar chamados');
    } finally {
      setLoading(false);
    }
  };

  const handleRated = () => {
    fetchTickets();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <GlassmorphismContainer key={i} className="p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
              <div className="h-3 bg-zinc-200 rounded w-1/2"></div>
            </div>
          </GlassmorphismContainer>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <GlassmorphismContainer className="bg-red-100/50 text-red-700 p-4 rounded-xl">
        <span className="block sm:inline">{error}</span>
      </GlassmorphismContainer>
    );
  }

  if (tickets.length === 0) {
    return (
      <GlassmorphismContainer className="p-6 text-center">
        <p className="text-zinc-500">Nenhum chamado encontrado.</p>
        {user?.role === 'colaborador' && (
          <Link href="/chamados/novo" className="text-zinc-800 hover:text-zinc-600 hover:underline mt-2 inline-block transition-colors">
            Criar um novo chamado
          </Link>
        )}
      </GlassmorphismContainer>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <GlassmorphismContainer
          key={ticket.id}
          className="hover:bg-white/40 dark:hover:bg-gray-800/40 transition-all cursor-pointer"
        >
          <Link href={`/chamados/${ticket.id}`} className="block p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                {ticket.title}
              </p>
              <div className="ml-2 flex-shrink-0 flex">
                <p className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(ticket.status)}`}>
                  {getStatusText(ticket.status)}
                </p>
              </div>
            </div>
            <div className="mt-2 sm:flex sm:justify-between">
              <div className="sm:flex">
                <p className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                  ID: {ticket.id.substring(0, 8)}...
                </p>
                <p className="mt-2 flex items-center text-sm text-zinc-500 dark:text-zinc-400 sm:mt-0 sm:ml-6">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPrioridadeBadgeClass(ticket.priority || 'media')}`}>
                    Prioridade: {ticket.priority || 'Não definida'}
                  </span>
                </p>
              </div>
              <div className="mt-2 flex items-center text-sm text-zinc-500 dark:text-zinc-400 sm:mt-0">
                <p>
                  {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </Link>
        </GlassmorphismContainer>
      ))}

      {showRatingModal && selectedTicket && user && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          ticketId={selectedTicket.id}
          userId={user.id}
          onRated={handleRated}
        />
      )}
    </div>
  );
} 