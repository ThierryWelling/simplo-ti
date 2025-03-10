# Configuração do Supabase

Este diretório contém os scripts e configurações necessários para o Supabase.

## Estrutura do Banco de Dados

O banco de dados consiste em três tabelas principais:

1. **profiles**: Armazena informações dos usuários
   - Vinculada à tabela de autenticação do Supabase
   - Contém informações como nome, email, função (role) e pontos

2. **tickets**: Armazena os chamados
   - Contém título, descrição, status, prioridade, categoria
   - Referências para o criador e o auxiliar responsável

3. **ticket_updates**: Armazena atualizações e comentários nos chamados
   - Mensagens e histórico de cada chamado

## Políticas de Segurança (RLS)

As políticas de Row Level Security (RLS) garantem que:

- Colaboradores só podem ver e atualizar seus próprios chamados
- Auxiliares podem ver todos os chamados, mas só podem atualizar os que estão atribuídos a eles
- Administradores têm acesso completo a todos os dados

## Como Usar

1. Crie um projeto no Supabase (https://supabase.com)
2. Execute o script `init.sql` no SQL Editor do Supabase
3. Configure as variáveis de ambiente no arquivo `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_do_supabase
   ```

## Funções e Triggers

O banco de dados inclui:

- Trigger para atualizar automaticamente o campo `updated_at` quando um registro é modificado 