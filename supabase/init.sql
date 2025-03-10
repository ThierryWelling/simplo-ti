-- Criar tabela de perfis
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('colaborador', 'auxiliar', 'admin')),
  department TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Criar tabela de chamados
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('aberto', 'em_andamento', 'concluido')) DEFAULT 'aberto',
  priority TEXT NOT NULL CHECK (priority IN ('baixa', 'media', 'alta', 'urgente')),
  category TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  assigned_to UUID REFERENCES profiles(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Criar tabela de atualizações de chamados
CREATE TABLE IF NOT EXISTS ticket_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de comentários
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Configurar RLS (Row Level Security)

-- Habilitar RLS nas tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Políticas para perfis
CREATE POLICY "Usuários podem ver seus próprios perfis" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Administradores podem ver todos os perfis" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Usuários podem criar seus próprios perfis" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Administradores podem atualizar perfis" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para chamados
CREATE POLICY "Colaboradores podem criar chamados" ON tickets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('colaborador', 'auxiliar', 'admin')
    )
  );

CREATE POLICY "Usuários podem ver seus próprios chamados" ON tickets
  FOR SELECT USING (
    created_by = auth.uid() OR 
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('auxiliar', 'admin')
    )
  );

CREATE POLICY "Auxiliares e administradores podem atualizar chamados" ON tickets
  FOR UPDATE USING (
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para atualizações de chamados
CREATE POLICY "Usuários podem ver atualizações de seus chamados" ON ticket_updates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tickets 
      WHERE tickets.id = ticket_updates.ticket_id AND 
      (tickets.created_by = auth.uid() OR tickets.assigned_to = auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('auxiliar', 'admin')
    )
  );

CREATE POLICY "Usuários podem criar atualizações em seus chamados" ON ticket_updates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tickets 
      WHERE tickets.id = ticket_updates.ticket_id AND 
      (tickets.created_by = auth.uid() OR tickets.assigned_to = auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('auxiliar', 'admin')
    )
  );

-- Políticas para comentários
CREATE POLICY "Usuários podem ver comentários de seus chamados" ON comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tickets 
      WHERE tickets.id = comments.ticket_id AND 
      (tickets.created_by = auth.uid() OR tickets.assigned_to = auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('auxiliar', 'admin')
    )
  );

CREATE POLICY "Usuários podem criar comentários em seus chamados" ON comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tickets 
      WHERE tickets.id = comments.ticket_id AND 
      (tickets.created_by = auth.uid() OR tickets.assigned_to = auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('auxiliar', 'admin')
    )
  );

CREATE POLICY "Usuários podem atualizar seus próprios comentários" ON comments
  FOR UPDATE USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Usuários podem excluir seus próprios comentários" ON comments
  FOR DELETE USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 