# 🔐 Sistema de Permissões - Symphony

## Visão Geral

O Symphony agora tem um sistema completo de permissões baseado em **roles** (funções de usuário). Existem 3 tipos de acesso:

- **client** (Cliente): Acesso básico
- **agency** (Agência): Acesso completo + features extras
- **admin** (Admin): Acesso total

---

## 📦 Como Funciona

### 1. Hook `usePermissions`

```typescript
import { usePermissions } from '@/hooks/usePermissions';

function MyComponent() {
  const { role, permissions, hasPermission, isClient, isAgency, isAdmin } = usePermissions();

  // Verifica se tem permissão específica
  if (hasPermission('canExportReports')) {
    // Mostra botão de exportar
  }

  // Verifica role
  if (isAgency) {
    // Mostra features de agência
  }
}
```

---

## 🛡️ Protegendo Rotas

### Opção 1: Proteção de Página Inteira

```tsx
// app/dashboard/team/page.tsx
import { ProtectedRoute } from '@/components/auth';

export default function TeamPage() {
  return (
    <ProtectedRoute requiredPermission="canManageTeam">
      <div>
        {/* Conteúdo da página de equipe */}
      </div>
    </ProtectedRoute>
  );
}
```

### Opção 2: Proteção de Features Inline

```tsx
import { ProtectedFeature } from '@/components/auth';

function ReportsPage() {
  return (
    <div>
      <h1>Relatórios</h1>

      {/* Botão só aparece para quem pode exportar */}
      <ProtectedFeature requiredPermission="canExportReports">
        <button>Exportar PDF</button>
      </ProtectedFeature>

      {/* Com fallback para quem não tem permissão */}
      <ProtectedFeature
        requiredPermission="canAccessAI"
        fallback={
          <button disabled>
            IA (Upgrade para Agência)
          </button>
        }
      >
        <button>Analisar com IA</button>
      </ProtectedFeature>

      {/* Com ícone de cadeado */}
      <ProtectedFeature requiredPermission="canUseBulkActions" showLock>
        <button>Ações em Massa</button>
      </ProtectedFeature>
    </div>
  );
}
```

---

## 📋 Permissões Disponíveis

### Analytics & Reports
- `canViewAnalytics` - Ver analytics básicas
- `canExportReports` - Exportar relatórios (PDF, CSV)
- `canViewDetailedMetrics` - Ver métricas detalhadas

### Content Management
- `canManageContent` - Gerenciar conteúdo
- `canApproveContent` - Aprovar conteúdo
- `canSchedulePosts` - Agendar posts

### Team & Users
- `canManageTeam` - Gerenciar equipe
- `canInviteUsers` - Convidar usuários
- `canViewAllProjects` - Ver todos os projetos

### Advanced Features
- `canAccessAI` - Acessar features de IA
- `canUseBulkActions` - Usar ações em massa
- `canCustomizeBranding` - Personalizar marca
- `canIntegrateAPIs` - Integrar APIs

### Billing
- `canViewBilling` - Ver billing
- `canManageSubscription` - Gerenciar assinatura

---

## 🎨 Menu Dinâmico (Sidebar)

A sidebar já está configurada para mostrar menus diferentes baseado no tipo de usuário:

### Cliente vê:
- Dashboard
- Calendar
- Briefing
- Content
- Reports
- Settings

### Agência vê TUDO acima +
- Team (Equipe)
- Clients (Clientes)
- Automation (Automação)
- White Label (Marca Branca)

---

## 💡 Exemplos Práticos

### 1. Esconder Botão para Clientes

```tsx
const { hasPermission } = usePermissions();

return (
  <div>
    {hasPermission('canExportReports') && (
      <button onClick={exportPDF}>
        Exportar PDF
      </button>
    )}
  </div>
);
```

### 2. Mostrar Badge "Agency Only"

```tsx
const { isAgency } = usePermissions();

return (
  <div className="flex items-center gap-2">
    <h2>Recursos Avançados</h2>
    {isAgency && (
      <span className="px-2 py-1 bg-gold/20 text-gold text-xs rounded">
        Agency
      </span>
    )}
  </div>
);
```

### 3. Redirecionar se Não Tiver Permissão

```tsx
import { usePermissions } from '@/hooks/usePermissions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function TeamPage() {
  const { hasPermission } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!hasPermission('canManageTeam')) {
      router.push('/dashboard');
    }
  }, [hasPermission, router]);

  return <div>Team Page</div>;
}
```

### 4. Mostrar Features Condicionais

```tsx
const { permissions } = usePermissions();

return (
  <div>
    {permissions.canAccessAI && (
      <AIAnalysis content={content} />
    )}

    {permissions.canUseBulkActions && (
      <BulkActionsToolbar selected={selected} />
    )}

    {permissions.canCustomizeBranding && (
      <BrandingSettings />
    )}
  </div>
);
```

---

## 🔧 Como Criar Novo Usuário de Agência

### Via Backend API:

```bash
curl -X POST https://symponhy-backend-production.up.railway.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "agency@symphony.com",
    "password": "Agency123",
    "fullName": "Agência Symphony",
    "accessType": "agency"
  }'
```

### Via Supabase Dashboard:

1. Abre: https://supabase.com
2. Vai em **Table Editor** → **users**
3. Edita o usuário
4. Muda `access_type` para **"agency"**

---

## 🚀 Testando

### Login como Cliente:
```
Email: admin@symphony.com
Password: Admin123
Tipo: client
```

### Login como Agência (criar novo):
```
Email: agency@symphony.com
Password: Agency123
Tipo: agency
```

---

## 📊 Matriz de Permissões

| Permissão | Cliente | Agência | Admin |
|-----------|---------|---------|-------|
| Ver Analytics | ✅ | ✅ | ✅ |
| Exportar Relatórios | ❌ | ✅ | ✅ |
| Gerenciar Equipe | ❌ | ✅ | ✅ |
| Acessar IA | ❌ | ✅ | ✅ |
| Ações em Massa | ❌ | ✅ | ✅ |
| White Label | ❌ | ✅ | ✅ |
| Integrar APIs | ❌ | ✅ | ✅ |

---

## 🎯 Próximos Passos

1. ✅ Sistema de permissões implementado
2. ✅ Menu dinâmico na sidebar
3. ✅ Componentes de proteção criados
4. ⏳ Criar páginas exclusivas de agência
5. ⏳ Implementar upgrade de plano
6. ⏳ Adicionar paywall/monetização

---

## 📝 Notas Importantes

- O `accessType` vem do backend no objeto `user`
- As permissões são calculadas no frontend baseado no role
- A sidebar mostra/esconde menus automaticamente
- Use `<ProtectedFeature>` para proteger componentes inline
- Use `<ProtectedRoute>` para proteger páginas inteiras
