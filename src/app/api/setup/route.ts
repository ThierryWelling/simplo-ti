import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Database } from '@/lib/database.types';

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Variáveis de ambiente do Supabase não estão definidas');
}

// Usar a chave de serviço para contornar as políticas de segurança
const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceKey)
  : null;

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: 'Configuração do Supabase incompleta' },
        { status: 500 }
      );
    }

    const { email, password, name, department } = await request.json();

    // Verificar se já existem usuários no sistema
    const { count, error: countError } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      return NextResponse.json(
        { message: 'Erro ao verificar usuários existentes' },
        { status: 500 }
      );
    }

    // Se já existirem usuários, não permitir a criação do admin inicial
    if (count && count > 0) {
      return NextResponse.json(
        { message: 'Já existem usuários no sistema. Esta página só pode ser usada para a configuração inicial.' },
        { status: 400 }
      );
    }

    // Criar o usuário na autenticação
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmar o email automaticamente
      user_metadata: {
        name,
        department,
      },
    });

    if (authError) {
      return NextResponse.json(
        { message: `Erro ao criar usuário: ${authError.message}` },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { message: 'Erro ao criar usuário: usuário não retornado' },
        { status: 500 }
      );
    }

    // Criar o perfil do administrador
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: authData.user.id,
      email,
      name,
      department,
      role: 'admin', // Definir como administrador
      points: 0,
      created_at: new Date().toISOString(),
    });

    if (profileError) {
      return NextResponse.json(
        { message: `Erro ao criar perfil: ${profileError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro na configuração inicial:', error);
    return NextResponse.json(
      { message: error.message || 'Erro ao configurar o sistema' },
      { status: 500 }
    );
  }
} 