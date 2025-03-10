-- Desabilitar temporariamente a RLS (Row Level Security) para todas as tabelas
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_updates DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;

-- Verificar e corrigir a função de gatilho auth.on_auth_user_created
-- Esta função é chamada automaticamente quando um novo usuário é criado
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, department, points, created_at)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    'colaborador',
    COALESCE(NEW.raw_user_meta_data->>'department', 'Geral'),
    0,
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover o gatilho existente se houver
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar o gatilho para inserir automaticamente um perfil quando um usuário é criado
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verificar e corrigir as permissões da tabela de perfis
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.profiles TO anon;

-- Verificar e corrigir as permissões das outras tabelas
GRANT ALL ON public.tickets TO authenticated;
GRANT ALL ON public.ticket_updates TO authenticated;
GRANT ALL ON public.comments TO authenticated;

-- Adicionar políticas de segurança mais permissivas (você pode restringi-las depois)
DROP POLICY IF EXISTS "Permitir inserção de perfis" ON public.profiles;
CREATE POLICY "Permitir inserção de perfis" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir seleção de perfis" ON public.profiles;
CREATE POLICY "Permitir seleção de perfis" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir atualização de perfis" ON public.profiles;
CREATE POLICY "Permitir atualização de perfis" ON public.profiles FOR UPDATE USING (true);

-- Depois de configurar tudo e criar o primeiro usuário, você pode habilitar a RLS novamente
-- e configurar políticas mais restritivas com:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ticket_updates ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE comments ENABLE ROW LEVEL SECURITY; 