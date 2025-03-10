import { supabase } from './supabase';
import { Database } from './database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export async function getUserProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Erro ao buscar perfil do usuário:', error);
    return null;
  }

  return data as Profile;
}

export async function getUsers(role?: 'colaborador' | 'auxiliar' | 'admin') {
  let query = supabase.from('profiles').select('*');

  if (role) {
    query = query.eq('role', role);
  }

  const { data, error } = await query.order('name');

  if (error) {
    throw new Error(error.message);
  }

  return data as Profile[];
}

export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Profile;
}

export async function updateUser(
  id: string,
  updates: {
    name?: string;
    email?: string;
    department?: string;
    role?: 'colaborador' | 'auxiliar' | 'admin';
    points?: number;
  }
) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Profile;
}

export async function deleteUser(id: string) {
  // Primeiro, verificar se o usuário existe
  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  // Verificar se o usuário é um administrador
  if (user.role === 'admin') {
    // Verificar se há outros administradores
    const { data: admins, error: adminsError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin');

    if (adminsError) {
      throw new Error(adminsError.message);
    }

    if (admins.length <= 1) {
      throw new Error('Não é possível excluir o último administrador');
    }
  }

  // Excluir o usuário
  const { error: deleteError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  // Excluir o usuário da autenticação
  const { error: authError } = await supabase.auth.admin.deleteUser(id);

  if (authError) {
    throw new Error(authError.message);
  }

  return true;
}

export async function getUserStats() {
  const { data: colaboradores, error: colaboradoresError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact' })
    .eq('role', 'colaborador');

  const { data: auxiliares, error: auxiliaresError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact' })
    .eq('role', 'auxiliar');

  const { data: admins, error: adminsError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact' })
    .eq('role', 'admin');

  if (colaboradoresError || auxiliaresError || adminsError) {
    throw new Error('Erro ao buscar estatísticas de usuários');
  }

  return {
    colaboradores: colaboradores.length,
    auxiliares: auxiliares.length,
    admins: admins.length,
    total: colaboradores.length + auxiliares.length + admins.length,
  };
}

export async function getTopAuxiliares(limit = 5) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'auxiliar')
    .order('points', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data as Profile[];
}

export async function getUserTicketsStats(userId: string) {
  const { data: created, error: createdError } = await supabase
    .from('tickets')
    .select('id', { count: 'exact' })
    .eq('created_by', userId);

  const { data: assigned, error: assignedError } = await supabase
    .from('tickets')
    .select('id', { count: 'exact' })
    .eq('assigned_to', userId);

  const { data: completed, error: completedError } = await supabase
    .from('tickets')
    .select('id', { count: 'exact' })
    .eq('assigned_to', userId)
    .eq('status', 'concluido');

  if (createdError || assignedError || completedError) {
    throw new Error('Erro ao buscar estatísticas de chamados do usuário');
  }

  return {
    created: created.length,
    assigned: assigned.length,
    completed: completed.length,
  };
} 