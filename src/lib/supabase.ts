import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Valores padrão para desenvolvimento/build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-anon-key';

// Criar cliente apenas se estiver rodando no browser ou se for um ambiente de produção
const isBrowser = typeof window !== 'undefined';
const isProduction = process.env.NODE_ENV === 'production';

let supabaseClient: any;

try {
  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.error('Erro ao criar cliente Supabase:', error);
  // Criar um cliente mock para evitar erros durante o build
  supabaseClient = {
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getSession: () => Promise.resolve({ data: { session: null } }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) }),
      insert: () => Promise.resolve({ data: null, error: null }),
      delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
  };
}

export const supabase = supabaseClient;

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