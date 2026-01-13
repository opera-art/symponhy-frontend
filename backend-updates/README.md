# Backend Updates - Clerk Organizations

## Arquivos para copiar

Copie estes arquivos para o repositório `symponhy-backend`:

```
backend-updates/
├── src/
│   ├── middleware/
│   │   └── clerkAuth.ts      → Substituir arquivo existente
│   ├── controllers/
│   │   └── membersController.ts  → Novo arquivo
│   ├── routes/
│   │   ├── members.ts        → Novo arquivo
│   │   └── webhooks.ts       → Novo arquivo
│   └── server.ts             → Substituir arquivo existente
```

## Variáveis de ambiente necessárias

Adicione no `.env` e nas variáveis do Railway:

```env
CLERK_SECRET_KEY=sk_live_xxx          # Dashboard Clerk > API Keys
CLERK_WEBHOOK_SECRET=whsec_xxx        # Dashboard Clerk > Webhooks
```

## Dependências

```bash
npm install svix
```

## Configurar Webhook no Clerk

1. Acesse: https://dashboard.clerk.com > Webhooks
2. Clique em "Add Endpoint"
3. URL: `https://symponhy-backend-production.up.railway.app/api/webhooks/clerk`
4. Selecione os eventos:
   - user.created
   - user.updated
   - user.deleted
   - organizationMembership.created
   - organizationMembership.updated
   - organizationMembership.deleted
5. Copie o "Signing Secret" para `CLERK_WEBHOOK_SECRET`

## Habilitar Organizations no Clerk

1. Acesse: https://dashboard.clerk.com > Organizations
2. Clique em "Enable Organizations"
3. Configure os roles (admin, member)

## Endpoints da nova API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/members | Lista membros da org |
| POST | /api/members/invite | Convida membro por email |
| POST | /api/members | Cria membro com senha |
| DELETE | /api/members/:userId | Remove membro |
| PUT | /api/members/:userId/role | Atualiza role |
| GET | /api/members/:userId/dashboard | Dashboard (View As) |
