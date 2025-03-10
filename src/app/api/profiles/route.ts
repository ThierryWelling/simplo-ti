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

    const { userId, email, name, department, role = 'colaborador' } = await request.json();

    // Verificar se o perfil já existe
    const { data: existingProfile, error: checkError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 é o código para "não encontrado"
      return NextResponse.json(
        { message: `Erro ao verificar perfil existente: ${checkError.message}` },
        { status: 500 }
      );
    }

    if (existingProfile) {
      return NextResponse.json(
        { message: 'Perfil já existe' },
        { status: 400 }
      );
    }

    // Criar o perfil do usuário
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: userId,
      email,
      name,
      department,
      role,
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
    console.error('Erro ao criar perfil:', error);
    return NextResponse.json(
      { message: error.message || 'Erro ao criar perfil' },
      { status: 500 }
    );
  }
} 