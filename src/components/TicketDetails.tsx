'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Ticket, getTicketById, getTicketUpdates, addTicketUpdate, assignTicket, closeTicket, rateTicket } from '@/lib/tickets';
import { getUserProfile } from '@/lib/users';
import { UserProfile } from '@/lib/supabase';
import { formatDate } from '@/utils/helpers';
import GlassmorphismContainer from './GlassmorphismContainer';
import StarRating from './StarRating';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

interface TicketDetailsProps {
  id: string;
}

export default function TicketDetails({ id }: TicketDetailsProps) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [updates, setUpdates] = useState<any[]>([]);
  const [requester, setRequester] = useState<UserProfile | null>(null);
  const [assignee, setAssignee] = useState<UserProfile | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const ticketData = await getTicketById(id);
        setTicket(ticketData);

        const requesterData = await getUserProfile(ticketData.created_by);
        if (requesterData) {
          setRequester({
            id: requesterData.id,
            email: requesterData.email,
            name: requesterData.name,
            role: requesterData.role,
            department: requesterData.department || undefined,
            points: requesterData.points || undefined
          });
        } else {
          setRequester(null);
        }

        if (ticketData.assigned_to) {
          const assigneeData = await getUserProfile(ticketData.assigned_to);
          if (assigneeData) {
            setAssignee({
              id: assigneeData.id,
              email: assigneeData.email,
              name: assigneeData.name,
              role: assigneeData.role,
              department: assigneeData.department || undefined,
              points: assigneeData.points || undefined
            });
          } else {
            setAssignee(null);
          }
        }

        const updatesData = await getTicketUpdates(id);
        const updatesWithAuthor = await Promise.all(
          updatesData.map(async (update) => {
            const authorData = await getUserProfile(update.created_by);
            return {
              ...update,
              authorName: authorData?.name || 'Usuário desconhecido'
            };
          })
        );
        
        setUpdates(updatesWithAuthor);
      } catch (error: any) {
        setError(error.message || 'Erro ao buscar dados do chamado');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;

    setActionLoading(true);
    try {
      await addTicketUpdate(id, comment, user.id);
      
      const updatesData = await getTicketUpdates(id);
      const updatesWithAuthor = await Promise.all(
        updatesData.map(async (update) => {
          const authorData = await getUserProfile(update.created_by);
          return {
            ...update,
            authorName: authorData?.name || 'Usuário desconhecido'
          };
        })
      );
      
      setUpdates(updatesWithAuthor);
      setComment('');
    } catch (error: any) {
      setError(error.message || 'Erro ao adicionar comentário');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignTicket = async () => {
    if (!user) return;

    setActionLoading(true);
    try {
      await assignTicket(id, user.id);
      
      const ticketData = await getTicketById(id);
      setTicket(ticketData);
      
      const assigneeData = await getUserProfile(user.id);
      setAssignee(assigneeData);
      
      const updatesData = await getTicketUpdates(id);
      const updatesWithAuthor = await Promise.all(
        updatesData.map(async (update) => {
          const authorData = await getUserProfile(update.created_by);
          return {
            ...update,
            authorName: authorData?.name || 'Usuário desconhecido'
          };
        })
      );
      
      setUpdates(updatesWithAuthor);
    } catch (error: any) {
      setError(error.message || 'Erro ao atribuir chamado');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!user) return;

    setActionLoading(true);
    try {
      await closeTicket(id, user.id);
      
      const ticketData = await getTicketById(id);
      setTicket(ticketData);
      
      const updatesData = await getTicketUpdates(id);
      const updatesWithAuthor = await Promise.all(
        updatesData.map(async (update) => {
          const authorData = await getUserProfile(update.created_by);
          return {
            ...update,
            authorName: authorData?.name || 'Usuário desconhecido'
          };
        })
      );
      
      setUpdates(updatesWithAuthor);
    } catch (error: any) {
      setError(error.message || 'Erro ao concluir chamado');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRateTicket = async (rating: number) => {
    if (!user || !ticket) return;

    setActionLoading(true);
    try {
      await rateTicket(id, rating, user.id);
      
      const ticketData = await getTicketById(id);
      setTicket(ticketData);
      
      const updatesData = await getTicketUpdates(id);
      const updatesWithAuthor = await Promise.all(
        updatesData.map(async (update) => {
          const authorData = await getUserProfile(update.created_by);
          return {
            ...update,
            authorName: authorData?.name || 'Usuário desconhecido'
          };
        })
      );
      
      setUpdates(updatesWithAuthor);
    } catch (error: any) {
      setError(error.message || 'Erro ao avaliar chamado');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600 dark:text-gray-300">Carregando dados do chamado...</p>
      </div>
    );
  }

  if (error) {
    return (
      <GlassmorphismContainer className="bg-red-100/50 dark:bg-red-900/50 text-red-700 dark:text-red-200 p-4 rounded-md mb-4">
        <span className="block sm:inline">{error}</span>
        <button
          onClick={() => router.push('/chamados')}
          className="mt-4 px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
        >
          Voltar para Chamados
        </button>
      </GlassmorphismContainer>
    );
  }

  if (!ticket) {
    return (
      <GlassmorphismContainer className="p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">Chamado não encontrado</p>
        <button
          onClick={() => router.push('/chamados')}
          className="mt-4 px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
        >
          Voltar para Chamados
        </button>
      </GlassmorphismContainer>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Chamado #{ticket.id.substring(0, 8)}
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            {ticket.title}
          </p>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      <GlassmorphismContainer className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Solicitante</h3>
            <p className="mt-1 text-gray-900 dark:text-white">
              {requester ? `${requester.name} (${requester.email})` : 'Carregando...'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Departamento</h3>
            <p className="mt-1 text-gray-900 dark:text-white">
              {requester?.department || 'Não informado'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Data de criação</h3>
            <p className="mt-1 text-gray-900 dark:text-white">
              {formatDate(ticket.created_at)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Categoria</h3>
            <p className="mt-1 text-gray-900 dark:text-white">
              {ticket.category}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Prioridade</h3>
            <div className="mt-1">
              <PriorityBadge priority={ticket.priority || 'media'} />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Auxiliar responsável</h3>
            <p className="mt-1 text-gray-900 dark:text-white">
              {assignee ? `${assignee.name} (${assignee.email})` : 'Não atribuído'}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Descrição</h3>
          <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-wrap">
            {ticket.description}
          </p>
        </div>

        {ticket.rating && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avaliação</h3>
            <div className="mt-1">
              <StarRating initialRating={ticket.rating} readOnly />
            </div>
          </div>
        )}
      </GlassmorphismContainer>

      <GlassmorphismContainer className="p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Atualizações
        </h2>
        {updates.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Nenhuma atualização disponível
          </p>
        ) : (
          <div className="space-y-4">
            {updates.map((update) => (
              <GlassmorphismContainer key={update.id} className="p-4">
                <div className="flex justify-between">
                  <p className="font-medium text-gray-900 dark:text-white">{update.authorName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(update.created_at)}</p>
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{update.message}</p>
              </GlassmorphismContainer>
            ))}
          </div>
        )}
      </GlassmorphismContainer>

      <GlassmorphismContainer className="p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Adicionar comentário
        </h2>
        <form className="space-y-4" onSubmit={handleAddComment}>
          <textarea
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-primary focus:border-primary"
            placeholder="Digite seu comentário aqui..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <div className="flex justify-end">
            <button 
              type="submit" 
              className="px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
              disabled={actionLoading}
            >
              {actionLoading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </GlassmorphismContainer>

      {ticket.status !== 'concluido' && (
        <GlassmorphismContainer className="p-6">
          <div className="flex justify-between">
            {ticket.status === 'aberto' && user?.role !== 'colaborador' && (
              <button 
                className="px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                onClick={handleAssignTicket}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processando...' : 'Atribuir a mim'}
              </button>
            )}
            
            {ticket.status === 'em_andamento' && (
              <button 
                className="px-4 py-2 bg-gray-500 text-white font-medium rounded-md opacity-50 cursor-not-allowed"
                disabled={true}
              >
                Transferir chamado
              </button>
            )}
            
            {(user?.role === 'auxiliar' || user?.role === 'admin') && (
              <button 
                className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                onClick={handleCloseTicket}
                disabled={actionLoading || ticket.status === 'aberto'}
              >
                {actionLoading ? 'Processando...' : 'Marcar como concluído'}
              </button>
            )}
          </div>
        </GlassmorphismContainer>
      )}

      {ticket.status === 'concluido' && !ticket.rating && user?.id === ticket.created_by && (
        <GlassmorphismContainer className="p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Avalie o atendimento
          </h2>
          <StarRating 
            onChange={handleRateTicket}
            size="lg"
          />
        </GlassmorphismContainer>
      )}
    </div>
  );
} 