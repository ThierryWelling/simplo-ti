import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type UserRole = 'colaborador' | 'auxiliar' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  points?: number;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'aberto' | 'em_andamento' | 'concluido';
  priority?: string;
  category?: string;
  created_at: string;
  created_by: string;
  assigned_to?: string;
  rating?: number;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Erro ao buscar perfil do usuário:', error);
    return null;
  }

  return data as UserProfile;
}

export async function subscribeToTickets(callback: (ticket: Ticket) => void) {
  return supabase
    .channel('public:tickets')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'tickets' },
      (payload: any) => {
        callback(payload.new as Ticket);
      }
    )
    .subscribe();
} 