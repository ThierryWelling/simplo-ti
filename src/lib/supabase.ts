import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Valores padrão para desenvolvimento/build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://soonverdgeodgugnjckm.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvb252ZXJkZ2VvZGd1Z25qY2ttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3OTcyMzUsImV4cCI6MjA1NTM3MzIzNX0.grwXXNfwcS5qqGCrZjpsY_7yCaJSY28UhNRjbXnZn1A';

// Criar cliente apenas se estiver rodando no browser ou se for um ambiente de produção
const isBrowser = typeof window !== 'undefined';
const isProduction = process.env.NODE_ENV === 'production';

let supabaseClient: any;

try {
  if (isBrowser || isProduction) {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
  } else {
    // Durante o build, usar um cliente mock
    supabaseClient = {
      auth: {
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => ({ 
          eq: () => ({ 
            single: () => Promise.resolve({ data: null, error: null }),
            order: () => Promise.resolve({ data: [], error: null })
          }),
          order: () => Promise.resolve({ data: [], error: null }),
          count: () => Promise.resolve({ count: 0, error: null })
        }),
        update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) }),
        insert: () => Promise.resolve({ data: null, error: null }),
        delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
      }),
      channel: () => ({
        on: () => ({ subscribe: () => Promise.resolve() }),
      }),
    };
  }
} catch (error) {
  console.error('Erro ao criar cliente Supabase:', error);
  // Em caso de erro, usar o cliente mock
  supabaseClient = {
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({ 
        eq: () => ({ 
          single: () => Promise.resolve({ data: null, error: null }),
          order: () => Promise.resolve({ data: [], error: null })
        }),
        order: () => Promise.resolve({ data: [], error: null }),
        count: () => Promise.resolve({ count: 0, error: null })
      }),
      update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) }),
      insert: () => Promise.resolve({ data: null, error: null }),
      delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
    channel: () => ({
      on: () => ({ subscribe: () => Promise.resolve() }),
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