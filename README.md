# MoldeTrack

Aplicação para a fábrica registar problemas em moldes e gerir stock de peças.
Next.js (App Router) + Prisma + Postgres + Tailwind, pronta para Vercel + Neon.

## Variáveis de ambiente

Copia `.env.example` para `.env` (localmente, se quiseres correr algo) e/ou
define-as no Vercel:

- `DATABASE_URL` — connection string Postgres (Neon).
- `MASTER_PASSWORD` — password mestre partilhada pela equipa para entrar no site.
- `PIN_CODE` — PIN de 4 dígitos para ações sensíveis (apagar moldes/peças).

## Deploy (sem correr nada localmente)

1. **Neon** — cria um projeto em neon.tech e copia a `DATABASE_URL`.
2. **GitHub** — garante que este código está num repositório.
3. **Vercel** — "Add New Project", escolhe o repositório, define as 3
   variáveis de ambiente acima em "Environment Variables" e clica em Deploy.
   O `npm run build` já corre `prisma generate` e `prisma migrate deploy`
   automaticamente, por isso as tabelas ficam criadas no primeiro deploy.
4. Abre o URL do Vercel, mete a password mestre, e usa "+ Adicionar operador"
   na página inicial para criares os operadores da tua equipa.

## Estrutura

- `/` — seleção de operador (+ link discreto para `/chefe`)
- `/dashboard` — painel com contadores e atalhos
- `/moldes`, `/moldes/[id]` — moldes, peças e problemas por molde
- `/stock` — stock de todas as peças, com entrada/saída rápida
- `/problemas`, `/problemas/novo` — lista geral e reportar problema
- `/chefe` — vista de leitura remota (problemas + stock)
- `middleware.ts` — protege todo o site com a password mestre + rate limit simples de login
