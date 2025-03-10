# Instruções de Build e Deploy

Este documento contém instruções para build e deploy do projeto App Simplo TI.

## Build para Produção

Para criar uma versão de produção do aplicativo, execute:

```bash
npm run build
```

Isso criará uma versão otimizada do aplicativo na pasta `.next`.

## Deploy

### Opção 1: Vercel (Recomendado)

A maneira mais fácil de fazer deploy deste aplicativo é usando a [Vercel](https://vercel.com), a plataforma dos criadores do Next.js.

1. Crie uma conta na Vercel
2. Instale a CLI da Vercel:
   ```bash
   npm i -g vercel
   ```
3. Execute o comando de deploy:
   ```bash
   vercel
   ```
4. Siga as instruções para configurar o projeto
5. Configure as variáveis de ambiente no dashboard da Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Opção 2: Servidor Próprio

Para fazer deploy em um servidor próprio:

1. Execute o build:
   ```bash
   npm run build
   ```
2. Inicie o servidor:
   ```bash
   npm start
   ```

Para manter o aplicativo em execução, recomendamos usar um gerenciador de processos como o PM2:

```bash
# Instalar PM2
npm install -g pm2

# Iniciar o aplicativo
pm2 start npm --name "app-simplo-ti" -- start

# Configurar para iniciar automaticamente
pm2 startup
pm2 save
```

## Configurações Adicionais

### CORS no Supabase

Se você estiver tendo problemas com CORS, configure as origens permitidas no Supabase:

1. Acesse o dashboard do Supabase
2. Vá para Authentication > Settings
3. Adicione seu domínio à lista de URLs permitidas

### Configuração de Domínio Personalizado

Se você estiver usando a Vercel, você pode configurar um domínio personalizado:

1. Acesse o dashboard da Vercel
2. Selecione seu projeto
3. Vá para Settings > Domains
4. Adicione seu domínio personalizado e siga as instruções

## Monitoramento

Para monitorar o desempenho e erros do aplicativo em produção, considere usar:

- [Sentry](https://sentry.io) para monitoramento de erros
- [Vercel Analytics](https://vercel.com/analytics) para análise de desempenho (se estiver usando a Vercel)

## Atualizações

Para atualizar o aplicativo:

1. Faça as alterações necessárias no código
2. Execute o build novamente
3. Faça o deploy da nova versão

Se estiver usando a Vercel, cada push para o repositório principal iniciará automaticamente um novo deploy. 