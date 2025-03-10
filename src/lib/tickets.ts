import { supabase } from './supabase';
import { Database } from './database.types';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'aberto' | 'em_andamento' | 'concluido' | 'cancelado';
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  created_by: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string | null;
  closed_at: string | null;
  rating: number | null;
  points: number | null;
}

export type TicketUpdate = Database['public']['Tables']['ticket_updates']['Row'];

export async function createTicket(
  title: string,
  description: string,
  category: string,
  priority: 'baixa' | 'media' | 'alta' | 'urgente',
  created_by: string
): Promise<Ticket> {
  const { data, error } = await supabase
    .from('tickets')
    .insert({
      title,
      description,
      category,
      priority,
      created_by,
      status: 'aberto',
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error('Erro ao criar chamado: ' + error.message);
  }

  return data;
}

export async function getTickets(filters: any = {}): Promise<Ticket[]> {
  let query = supabase.from('tickets').select('*');

  // Aplicar filtros
  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.assigned_to) {
    if (Array.isArray(filters.assigned_to)) {
      // Se o array inclui null, precisamos usar or() para combinar is_null e in
      if (filters.assigned_to.includes(null)) {
        const nonNullValues = filters.assigned_to.filter((id: string | null) => id !== null);
        query = query.or(`assigned_to.is.null,assigned_to.in.(${nonNullValues.join(',')})`);
      } else {
        query = query.in('assigned_to', filters.assigned_to);
      }
    } else {
      query = query.eq('assigned_to', filters.assigned_to);
    }
  }

  if (filters.created_by) {
    query = query.eq('created_by', filters.created_by);
  }

  // Ordenar por data de criação (mais recentes primeiro)
  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error('Erro ao buscar chamados: ' + error.message);
  }

  return data || [];
}

export async function getTicketById(id: string): Promise<Ticket> {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error('Erro ao buscar chamado: ' + error.message);
  }

  if (!data) {
    throw new Error('Chamado não encontrado');
  }

  return data;
}

export async function updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket> {
  const { data, error } = await supabase
    .from('tickets')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error('Erro ao atualizar chamado: ' + error.message);
  }

  return data;
}

export async function assignTicket(ticketId: string, userId: string): Promise<Ticket> {
  try {
    // Primeiro, verificar se o chamado já está atribuído
    const { data: currentTicket } = await supabase
      .from('tickets')
      .select('assigned_to')
      .eq('id', ticketId)
      .single();

    if (currentTicket?.assigned_to) {
      throw new Error('Este chamado já está atribuído a outro auxiliar');
    }

    // Atribuir o chamado
    const { data, error } = await supabase
      .from('tickets')
      .update({
        assigned_to: userId,
        status: 'em_andamento',
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      throw new Error('Erro ao atribuir chamado: ' + error.message);
    }

    // Adicionar atualização ao histórico
    const { error: updateError } = await supabase
      .from('ticket_updates')
      .insert({
        ticket_id: ticketId,
        message: 'Chamado atribuído e em andamento',
        created_by: userId,
        created_at: new Date().toISOString()
      });

    if (updateError) {
      console.error('Erro ao adicionar histórico:', updateError);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function closeTicket(ticketId: string, userId: string): Promise<Ticket> {
  const { data, error } = await supabase
    .from('tickets')
    .update({
      status: 'concluido',
      closed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', ticketId)
    .select()
    .single();

  if (error) {
    throw new Error('Erro ao concluir chamado: ' + error.message);
  }

  return data;
}

export async function rateTicket(ticketId: string, rating: number, userId: string): Promise<Ticket> {
  try {
    // Primeiro, buscar o chamado para obter o auxiliar responsável
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .single();

    if (ticketError || !ticket) {
      throw new Error('Erro ao buscar chamado: ' + ticketError?.message);
    }

    if (!ticket.assigned_to) {
      throw new Error('Este chamado não possui um auxiliar atribuído');
    }

    // Atualizar a avaliação do chamado
    const { data, error } = await supabase
      .from('tickets')
      .update({
        rating,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      throw new Error('Erro ao avaliar chamado: ' + error.message);
    }

    // Adicionar atualização ao histórico
    await addTicketUpdate(
      ticketId,
      `Chamado avaliado com ${rating} estrelas`,
      userId
    );

    // Calcular e atribuir pontos ao auxiliar
    const pointsToAdd = Math.round(10 * (rating / 5)); // 10 pontos máximos para 5 estrelas

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', ticket.assigned_to)
      .single();

    if (profileError) {
      throw new Error('Erro ao buscar perfil do auxiliar: ' + profileError.message);
    }

    const currentPoints = profile?.points || 0;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        points: currentPoints + pointsToAdd,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticket.assigned_to);

    if (updateError) {
      throw new Error('Erro ao atualizar pontos do auxiliar: ' + updateError.message);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getTicketUpdates(ticketId: string) {
  const { data, error } = await supabase
    .from('ticket_updates')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error('Erro ao buscar atualizações do chamado: ' + error.message);
  }

  return data || [];
}

export async function addTicketUpdate(ticketId: string, message: string, userId: string) {
  const { error } = await supabase
    .from('ticket_updates')
    .insert({
      ticket_id: ticketId,
      message,
      created_by: userId,
      created_at: new Date().toISOString()
    });

  if (error) {
    throw new Error('Erro ao adicionar atualização: ' + error.message);
  }
}

export async function getTicketStats() {
  const { data: open, error: openError } = await supabase
    .from('tickets')
    .select('id', { count: 'exact' })
    .eq('status', 'aberto');

  const { data: inProgress, error: inProgressError } = await supabase
    .from('tickets')
    .select('id', { count: 'exact' })
    .eq('status', 'em_andamento');

  const { data: completed, error: completedError } = await supabase
    .from('tickets')
    .select('id', { count: 'exact' })
    .eq('status', 'concluido');

  if (openError || inProgressError || completedError) {
    throw new Error('Erro ao buscar estatísticas de chamados');
  }

  return {
    open: open.length,
    inProgress: inProgress.length,
    completed: completed.length,
    total: open.length + inProgress.length + completed.length,
  };
} 