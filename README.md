# App Simplo TI

Sistema de gerenciamento de chamados para equipe de TI.

## Funcionalidades

- Autenticação de usuários (colaboradores, auxiliares e administradores)
- Criação e gerenciamento de chamados
- Distribuição de chamados em tempo real
- Avaliação de atendimento
- Sistema de pontuação para auxiliares
- Painel administrativo
- Promoção de colaboradores para auxiliares
- Primeiro usuário automaticamente definido como administrador

## Tecnologias

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Supabase (autenticação, banco de dados e real-time)

## Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto
   - Adicione as seguintes variáveis:
     ```
     NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
     NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
     SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_do_supabase
     ```

4. Execute o script SQL para configurar o banco de dados:
   - O script está localizado em `supabase/dados_iniciais.sql`
   - Execute-o no SQL Editor do Supabase

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

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

## Características Especiais

### Primeiro Usuário como Administrador

O primeiro usuário a se registrar no sistema será automaticamente definido como administrador. Isso permite que esse usuário tenha acesso ao painel administrativo e possa gerenciar outros usuários.

### Promoção de Colaboradores

Os administradores podem promover colaboradores para a função de auxiliar através do painel administrativo. Isso permite que mais usuários possam atender chamados conforme a necessidade da equipe.

## Documentação Adicional

Para instruções mais detalhadas, consulte os seguintes arquivos:

- `INSTRUCOES.md`: Guia completo de configuração e uso
- `DEPLOY.md`: Instruções para implantação em produção 