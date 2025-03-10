import { supabase } from './supabase';
import { Database } from './database.types';

export type UserRole = 'colaborador' | 'auxiliar' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  points?: number;
}

export async function signUp(email: string, password: string, name: string, department: string) {
  try {
    // Primeiro, verificar se o email já existe na autenticação
    const { data: authUser, error: authCheckError } = await supabase.auth.admin.listUsers();
    
    if (authCheckError) {
      throw new Error('Erro ao verificar email existente');
    }

    const emailExists = authUser.users.some(user => user.email === email);
    if (emailExists) {
      throw new Error('Este email já está cadastrado');
    }

    // Verificar se o email já existe na tabela de perfis
    const { data: existingProfiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email);

    if (profileError) {
      throw new Error('Erro ao verificar email existente');
    }

    if (existingProfiles && existingProfiles.length > 0) {
      throw new Error('Este email já está cadastrado');
    }

    // Se o email não existe, prosseguir com o registro
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          name,
          department
        }
      }
    });

    if (signUpError) {
      throw new Error(signUpError.message);
    }

    if (!authData.user) {
      throw new Error('Falha ao criar usuário');
    }

    // Verificar se é o primeiro usuário (será administrador)
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw new Error(`Erro ao verificar usuários existentes: ${countError.message}`);
    }

    const isFirstUser = count === 0;
    const userRole = isFirstUser ? 'admin' : 'colaborador';

    // Criar o perfil do usuário
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        name,
        department,
        role: userRole,
        points: 0,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      throw new Error(`Erro ao criar perfil: ${insertError.message}`);
    }

    return authData;
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao criar usuário');
  }
}

export async function signIn(email: string, password: string) {
  try {
    // Primeiro verificar se o email está confirmado
    const { data: { user: authUser }, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      // Se o erro for de credenciais inválidas
      if (authError.message.includes('Email not confirmed')) {
        throw new Error('EMAIL_NOT_CONFIRMED');
      }
      if (authError.message.includes('Invalid login credentials')) {
        throw new Error('Email ou senha incorretos');
      }
      throw authError;
    }

    if (!authUser) {
      throw new Error('Falha ao fazer login');
    }

    // Se o email não foi confirmado
    if (!authUser.email_confirmed_at) {
      throw new Error('EMAIL_NOT_CONFIRMED');
    }

    // Buscar o perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (profileError || !profile) {
      throw new Error('Erro ao buscar perfil do usuário');
    }

    return profile;
  } catch (error: any) {
    if (error.message === 'EMAIL_NOT_CONFIRMED') {
      throw new Error('EMAIL_NOT_CONFIRMED');
    }
    throw error;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error('Erro ao fazer logout');
  }
}

export async function getCurrentUser() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error('Erro ao verificar sessão');
  }

  if (!session?.user) {
    return null;
  }

  // Buscar o perfil do usuário
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (profileError || !profile) {
    throw new Error('Erro ao buscar perfil do usuário');
  }

  return profile;
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error('Erro ao atualizar perfil');
  }

  return data;
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: 'colaborador' | 'auxiliar' | 'admin',
  department: string
) {
  // Verificar se o usuário atual é um administrador
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Você precisa estar autenticado para criar usuários');
  }
  
  const { data: currentUser } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  if (!currentUser || currentUser.role !== 'admin') {
    throw new Error('Apenas administradores podem criar usuários');
  }
  
  // Criar o usuário
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error('Falha ao criar usuário');
  }

  // Criar o perfil do usuário
  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    email,
    name,
    department,
    role,
    points: 0,
    created_at: new Date().toISOString(),
  });

  if (profileError) {
    // Se houver erro ao criar o perfil, tente excluir o usuário para evitar inconsistências
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw new Error(`Erro ao criar perfil: ${profileError.message}`);
  }

  return authData;
}

export async function updateUserRole(userId: string, role: 'colaborador' | 'auxiliar' | 'admin') {
  // Verificar se o usuário atual é um administrador
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Você precisa estar autenticado para atualizar funções de usuários');
  }
  
  const { data: currentUser } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  if (!currentUser || currentUser.role !== 'admin') {
    throw new Error('Apenas administradores podem atualizar funções de usuários');
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId);
  
  if (error) {
    throw new Error(error.message);
  }
}

export async function updateUserPoints(userId: string, points: number) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('points')
    .eq('id', userId)
    .single();
  
  if (!profile) {
    throw new Error('Usuário não encontrado');
  }
  
  const currentPoints = profile.points || 0;
  const newPoints = currentPoints + points;
  
  const { error } = await supabase
    .from('profiles')
    .update({ 
      points: newPoints,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return newPoints;
}

export async function resendConfirmationEmail(email: string) {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/login`
      }
    });

    if (error) {
      throw new Error('Erro ao reenviar email de confirmação: ' + error.message);
    }

    return true;
  } catch (error: any) {
    throw new Error('Erro ao reenviar email de confirmação: ' + error.message);
  }
} 