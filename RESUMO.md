# App Simplo TI - Resumo do Projeto

## Visão Geral

O App Simplo TI é um sistema de gerenciamento de chamados para equipes de TI, permitindo que colaboradores da empresa abram chamados que são atendidos por auxiliares (assistentes de TI). O sistema inclui funcionalidades de avaliação de atendimento e um sistema de pontuação para os auxiliares.

## Principais Funcionalidades

### Para Colaboradores
- Criação de chamados com título, descrição, categoria e prioridade
- Acompanhamento do status dos chamados
- Avaliação do atendimento após a conclusão do chamado

### Para Auxiliares
- Visualização de chamados em tempo real
- Atribuição de chamados a si mesmo
- Atualização do status e adição de comentários
- Acúmulo de pontos baseado nas avaliações recebidas

### Para Administradores
- Gerenciamento de usuários (criação, edição, exclusão)
- Monitoramento de chamados e estatísticas
- Visualização do ranking de auxiliares por pontuação

## Tecnologias Utilizadas

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Banco de dados PostgreSQL, Autenticação, Funções)
- **Tempo Real**: Supabase Realtime para notificações instantâneas

## Estrutura do Banco de Dados

O sistema utiliza três tabelas principais:

1. **profiles**: Armazena informações dos usuários
2. **tickets**: Armazena os chamados
3. **ticket_updates**: Armazena atualizações e comentários nos chamados

## Fluxo de Uso

1. Um colaborador cria um chamado especificando título, descrição, categoria e prioridade
2. Os auxiliares recebem notificação do novo chamado em tempo real
3. Um auxiliar atribui o chamado a si mesmo, alterando seu status para "em andamento"
4. O auxiliar resolve o problema e marca o chamado como "concluído"
5. O colaborador avalia o atendimento (1 a 5 estrelas)
6. O auxiliar recebe pontos baseados na avaliação

## Segurança

O sistema implementa controle de acesso baseado em funções (RBAC):

- Colaboradores só podem ver e atualizar seus próprios chamados
- Auxiliares podem ver todos os chamados, mas só podem atualizar os que estão atribuídos a eles
- Administradores têm acesso completo a todos os dados

## Implantação

O projeto pode ser implantado facilmente na Vercel ou em qualquer servidor que suporte Node.js. As instruções detalhadas estão disponíveis nos arquivos SETUP.md e DEPLOY.md. 