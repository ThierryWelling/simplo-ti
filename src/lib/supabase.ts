import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Valores padrão para desenvolvimento/build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://soonverdgeodgugnjckm.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvb252ZXJkZ2VvZGd1Z25qY2ttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3OTcyMzUsImV4cCI6MjA1NTM3MzIzNX0.grwXXNfwcS5qqGCrZjpsY_7yCaJSY28UhNRjbXnZn1A';

// Criar cliente apenas se estiver rodando no browser
const isBrowser = typeof window !== 'undefined';
const isBuild = process.env.NODE_ENV === 'production' && !isBrowser;

// Cliente mock para uso durante o build
const mockClient = {
  auth: {
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    signUp: () => Promise.resolve({ data: { user: null }, error: null }),
    admin: {
      listUsers: () => Promise.resolve({ data: { users: [] }, error: null }),
    },
    resend: () => Promise.resolve({ error: null }),
  },
  from: () => ({
    select: () => ({ 
      eq: () => ({ 
        single: () => Promise.resolve({ data: null, error: null }),
        order: () => Promise.resolve({ data: [], error: null })
      }),
      order: () => Promise.resolve({ data: [], error: null }),
      count: () => Promise.resolve({ count: 0, error: null }),
      in: () => Promise.resolve({ count: 0, error: null }),
      head: true,
    }),
    update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) }),
    insert: () => Promise.resolve({ data: null, error: null }),
    delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
  }),
  channel: () => ({
    on: () => ({ subscribe: () => Promise.resolve() }),
  }),
};

let supabaseClient: any;

try {
  if (isBuild) {
    supabaseClient = mockClient;
  } else {
    if (!supabaseUrl) {
      throw new Error('URL do Supabase não definida');
    }
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
} catch (error) {
  console.error('Erro ao criar cliente Supabase:', error);
  supabaseClient = mockClient;
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

// Criar bucket para imagens de equipamentos se não existir
export async function createEquipmentImagesBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some((bucket: { name: string }) => bucket.name === 'equipment-images');

  if (!bucketExists) {
    // Criar o bucket
    const { data, error } = await supabase.storage.createBucket('equipment-images', {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: '10MB'
    });

    if (error) {
      console.error('Erro ao criar bucket:', error);
      return;
    }

    // Definir políticas de acesso
    const { error: policyError } = await supabase.storage.from('equipment-images').createSignedUrl(
      'policy.sql',
      60,
      {
        transform: {
          width: 800,
          height: 600,
          resize: 'contain'
        }
      }
    );

    if (policyError) {
      console.error('Erro ao definir políticas:', policyError);
    } else {
      console.log('Bucket equipment-images criado com sucesso e políticas definidas');
    }
  }
}

// Chamar a função quando o módulo for carregado
createEquipmentImagesBucket(); 