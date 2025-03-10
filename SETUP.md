# Configuração do Projeto App Simplo TI

Este documento contém instruções para configurar e executar o projeto App Simplo TI.

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm (versão 8 ou superior)
- Conta no Supabase (https://supabase.com)

## Passos para Configuração

### 1. Configurar o Supabase

1. Crie uma conta no Supabase (se ainda não tiver)
2. Crie um novo projeto
3. No SQL Editor, execute o script contido em `supabase/init.sql`
4. Nas configurações do projeto, obtenha as seguintes informações:
   - URL do projeto
   - Chave anônima (anon key)
   - Chave de serviço (service role key)

### 2. Configurar Variáveis de Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione as seguintes variáveis:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_do_supabase
   ```

### 3. Instalar Dependências

```bash
npm install
```

### 4. Executar o Projeto em Desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

### 5. Criar Usuário Administrador

1. Registre um usuário normal através da interface
2. No Supabase, acesse a tabela `profiles` e altere o campo `role` do usuário para `admin`

## Estrutura do Projeto

- `/src/app`: Rotas e páginas da aplicação
- `/src/components`: Componentes reutilizáveis
- `/src/lib`: Bibliotecas e configurações
- `/src/utils`: Funções utilitárias
- `/supabase`: Scripts e configurações do Supabase

## Roles de Usuário

- **Colaborador**: Cria chamados e avalia o atendimento
- **Auxiliar**: Recebe e atende chamados
- **Administrador**: Gerencia usuários, pontos e monitora chamados

## Fluxo de Uso

1. Colaborador cria um chamado
2. Auxiliares visualizam o chamado em tempo real
3. Um auxiliar atribui o chamado a si mesmo
4. O auxiliar atende e marca como concluído
5. O colaborador avalia o atendimento
6. O auxiliar recebe pontos baseados na avaliação 