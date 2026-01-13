# Migração para Clerk Organizations

## Resumo da Arquitetura

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│    FRONTEND      │────▶│     BACKEND      │────▶│    SUPABASE      │
│   (Next.js)      │     │   (Express)      │     │   (PostgreSQL)   │
├──────────────────┤     ├──────────────────┤     ├──────────────────┤
│ • ClerkProvider  │     │ • clerkAuth      │     │ • profiles       │
│ • useOrganization│     │ • /api/members   │     │ • posts          │
│ • /api/proxy/*   │     │ • /api/webhooks  │     │ • calendar_events│
└──────────────────┘     └──────────────────┘     └──────────────────┘
         │                        │
         └────────────────────────┘
              Clerk (Auth)
         • Users, Sessions
         • Organizations
         • Invites
```

## Checklist de Implementação

### 1. Clerk Dashboard
- [ ] Habilitar Organizations: https://dashboard.clerk.com > Organizations
- [ ] Criar webhook endpoint
- [ ] Copiar CLERK_SECRET_KEY e CLERK_WEBHOOK_SECRET

### 2. Supabase
- [ ] Executar `MIGRATION_CLERK_ORGANIZATIONS.sql` no SQL Editor
- [ ] Verificar se tabelas foram criadas corretamente

### 3. Backend (symponhy-backend)
- [ ] Copiar arquivos de `backend-updates/` para o repo
- [ ] Instalar dependência: `npm install svix`
- [ ] Adicionar variáveis de ambiente no Railway:
  - `CLERK_SECRET_KEY`
  - `CLERK_WEBHOOK_SECRET`
- [ ] Deploy

### 4. Frontend (já atualizado)
- [ ] Verificar se proxy envia X-Clerk-Org-Id
- [ ] Testar página de membros

---

## Arquivos Criados/Modificados

### Frontend (este repo)
```
src/app/dashboard/clients/page.tsx  ← Atualizado para usar Organizations
src/app/api/proxy/[...path]/route.ts  ← Já envia orgId e orgRole
MIGRATION_CLERK_ORGANIZATIONS.sql  ← SQL para Supabase
CLERK_ORGANIZATIONS_SETUP.md  ← Este arquivo
```

### Backend (copiar para symponhy-backend)
```
backend-updates/
├── src/
│   ├── middleware/
│   │   └── clerkAuth.ts  ← Substituir existente
│   ├── controllers/
│   │   └── membersController.ts  ← Novo
│   ├── routes/
│   │   ├── members.ts  ← Novo
│   │   └── webhooks.ts  ← Novo
│   └── server.ts  ← Substituir existente
└── README.md
```

---

## Configurar Webhook no Clerk

1. Acesse: https://dashboard.clerk.com > Webhooks
2. Add Endpoint:
   - URL: `https://symponhy-backend-production.up.railway.app/api/webhooks/clerk`
3. Selecione eventos:
   - `user.created`
   - `user.updated`
   - `user.deleted`
   - `organizationMembership.created`
   - `organizationMembership.updated`
   - `organizationMembership.deleted`
4. Copie "Signing Secret" → `CLERK_WEBHOOK_SECRET`

---

## API de Membros

### Endpoints

| Método | Endpoint | Descrição | Quem pode |
|--------|----------|-----------|-----------|
| GET | /api/members | Lista membros | Todos |
| POST | /api/members/invite | Convida por email | Admin |
| POST | /api/members | Cria com senha | Admin |
| DELETE | /api/members/:userId | Remove membro | Admin |
| PUT | /api/members/:userId/role | Muda role | Admin |
| GET | /api/members/:userId/dashboard | Ver como | Admin |

### Roles

| Role | Descrição | Pode fazer |
|------|-----------|------------|
| `admin` | Dono/Agência | Tudo |
| `member` | Cliente | Ver próprios dados |

---

## Fluxo de Adição de Cliente

### Opção 1: Convite por Email
```
Agência clica "Convidar"
    ↓
POST /api/members/invite { email }
    ↓
Clerk envia email ao cliente
    ↓
Cliente aceita e cria conta
    ↓
Webhook sincroniza com Supabase
    ↓
Cliente aparece na lista
```

### Opção 2: Criação Direta
```
Agência clica "Criar Membro"
    ↓
POST /api/members { email, password, firstName, lastName }
    ↓
Backend cria user no Clerk
    ↓
Backend adiciona à Organization
    ↓
Backend cria profile no Supabase
    ↓
Cliente pode fazer login imediatamente
```

---

## Troubleshooting

### "Organização não encontrada"
- Usuário não pertence a nenhuma org
- Precisa criar org ou ser convidado

### "Apenas administradores podem..."
- Usuário é `member`, não `admin`
- Apenas donos da org podem gerenciar

### Webhook não funciona
- Verificar CLERK_WEBHOOK_SECRET
- Verificar se eventos estão selecionados
- Ver logs no Railway

### Membro não aparece após convite
- Convite precisa ser aceito primeiro
- Verifique email do cliente
