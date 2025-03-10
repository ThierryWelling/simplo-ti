-- Inserir usuários iniciais
-- Nota: Estes são apenas exemplos. Em um ambiente real, você deve criar usuários através da interface ou API.
-- As senhas devem ser definidas através da interface de autenticação do Supabase.

-- Inserir um administrador
INSERT INTO profiles (id, name, email, role, department, points, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Admin', 'admin@exemplo.com', 'admin', 'TI', 0, NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserir auxiliares
INSERT INTO profiles (id, name, email, role, department, points, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'Carlos Ferreira', 'carlos@exemplo.com', 'auxiliar', 'TI', 120, NOW()),
  ('00000000-0000-0000-0000-000000000003', 'Ana Souza', 'ana@exemplo.com', 'auxiliar', 'TI', 85, NOW()),
  ('00000000-0000-0000-0000-000000000004', 'Roberto Lima', 'roberto@exemplo.com', 'auxiliar', 'TI', 150, NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserir colaboradores
INSERT INTO profiles (id, name, email, role, department, points, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000005', 'João Silva', 'joao@exemplo.com', 'colaborador', 'Financeiro', 0, NOW()),
  ('00000000-0000-0000-0000-000000000006', 'Maria Oliveira', 'maria@exemplo.com', 'colaborador', 'RH', 0, NOW()),
  ('00000000-0000-0000-0000-000000000007', 'Pedro Santos', 'pedro@exemplo.com', 'colaborador', 'Marketing', 0, NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserir chamados de exemplo
INSERT INTO tickets (id, title, description, status, priority, category, created_by, assigned_to, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Computador não liga', 'Ao tentar ligar o computador, ele não mostra nenhum sinal de energia. Já verifiquei a tomada e o cabo de força.', 'aberto', 'alta', 'hardware', '00000000-0000-0000-0000-000000000005', NULL, NOW() - INTERVAL '2 days'),
  
  ('00000000-0000-0000-0000-000000000002', 'Problema com impressora', 'A impressora está imprimindo páginas com manchas. Já troquei o toner, mas o problema persiste.', 'em_andamento', 'media', 'hardware', '00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '1 day'),
  
  ('00000000-0000-0000-0000-000000000003', 'Acesso ao sistema bloqueado', 'Não consigo acessar o sistema de gestão. Aparece uma mensagem de usuário bloqueado.', 'concluido', 'alta', 'software', '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '3 days'),
  
  ('00000000-0000-0000-0000-000000000004', 'Lentidão na rede', 'A internet está muito lenta desde ontem. Afeta todos os computadores do departamento.', 'aberto', 'media', 'rede', '00000000-0000-0000-0000-000000000005', NULL, NOW() - INTERVAL '12 hours'),
  
  ('00000000-0000-0000-0000-000000000005', 'Erro ao abrir anexos de e-mail', 'Quando tento abrir anexos de e-mail, recebo uma mensagem de erro.', 'em_andamento', 'baixa', 'email', '00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '5 hours')
ON CONFLICT (id) DO NOTHING;

-- Inserir atualizações de chamados
INSERT INTO ticket_updates (id, ticket_id, message, created_by, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Chamado criado', '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '2 days'),
  
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Chamado criado', '00000000-0000-0000-0000-000000000006', NOW() - INTERVAL '1 day'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Chamado atribuído a Carlos Ferreira', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '23 hours'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'Estou verificando o problema. Vou passar no seu departamento em 15 minutos.', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '22 hours'),
  
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', 'Chamado criado', '00000000-0000-0000-0000-000000000007', NOW() - INTERVAL '3 days'),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 'Chamado atribuído a Ana Souza', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '3 days'),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', 'Problema resolvido. O usuário estava bloqueado por excesso de tentativas de login. Desbloqueei o acesso.', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '2 days 12 hours'),
  
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000004', 'Chamado criado', '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '12 hours'),
  
  ('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000005', 'Chamado criado', '00000000-0000-0000-0000-000000000006', NOW() - INTERVAL '5 hours'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000005', 'Chamado atribuído a Roberto Lima', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '4 hours 30 minutes'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000005', 'Estou verificando as configurações do seu cliente de e-mail.', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '4 hours')
ON CONFLICT (id) DO NOTHING;

-- Inserir comentários de exemplo
INSERT INTO comments (id, ticket_id, content, created_by, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000002', 'Já tentei reiniciar a impressora várias vezes, mas o problema persiste.', '00000000-0000-0000-0000-000000000006', NOW() - INTERVAL '22 hours'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000002', 'Vou verificar se há algum problema com o driver da impressora.', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '21 hours'),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000002', 'Também já tentei usar outra impressora da rede, mas o problema continua.', '00000000-0000-0000-0000-000000000006', NOW() - INTERVAL '20 hours'),
  
  ('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000003', 'Já tentei redefinir minha senha, mas não funcionou.', '00000000-0000-0000-0000-000000000007', NOW() - INTERVAL '2 days 23 hours'),
  ('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000003', 'Vou verificar no sistema de administração de usuários.', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '2 days 22 hours'),
  ('00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000003', 'Obrigado pela ajuda! Consegui acessar o sistema agora.', '00000000-0000-0000-0000-000000000007', NOW() - INTERVAL '2 days 10 hours')
ON CONFLICT (id) DO NOTHING;

-- Atualizar o chamado concluído com avaliação
UPDATE tickets
SET rating = 5, updated_at = NOW() - INTERVAL '2 days'
WHERE id = '00000000-0000-0000-0000-000000000003'
AND rating IS NULL; 