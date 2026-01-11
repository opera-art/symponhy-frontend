# 👥 Guia de Gerenciamento de Clientes - Symphony

## 🎯 Visão Geral

Sistema completo de **multi-tenancy** onde agências podem:
- ✅ Cadastrar clientes
- ✅ Gerenciar acesso de clientes
- ✅ **Visualizar dados do cliente SEM fazer login como ele**
- ✅ Fazer tudo que o cliente faz, mas no contexto do cliente

---

## 🏗️ Arquitetura

### Hierarquia de Usuários

```
Agência (accessType: "agency")
  │
  ├── Cliente 1 (accessType: "client", agency_id: X)
  ├── Cliente 2 (accessType: "client", agency_id: X)
  └── Cliente 3 (accessType: "client", agency_id: X)
```

### Conceito de "View As"

A agência pode **visualizar como cliente** sem fazer logout/login:

1. Agência clica em **"Ver como"** no cliente
2. Um **banner dourado** aparece no topo mostrando: *"Visualizando como: Cliente X"*
3. Todo o dashboard mostra dados **do cliente selecionado**
4. Agência pode clicar em **"Voltar para Agência"** no banner

---

## 📋 Features Implementadas

### 1. **Página de Clientes** (`/dashboard/clients`)

**Acesso**: Apenas usuários com `accessType: "agency"`

**Componentes**:
- ✅ Lista de clientes com tabela
- ✅ Cards de estatísticas (Total, Ativos, Novos)
- ✅ Botão "Adicionar Cliente"
- ✅ Botão "Ver como" para cada cliente
- ✅ Menu de ações (editar, excluir)

### 2. **Context Switching (View As)**

**Hook**: `useClientContext()`

```typescript
import { useClientContext } from '@/context/ClientContext';

function MyComponent() {
  const {
    selectedClient,      // Cliente selecionado (null se não tiver)
    isViewingAsClient,   // Boolean: true se estiver vendo como cliente
    setSelectedClient,   // Função para setar o cliente
    clearClientView      // Limpar visualização
  } = useClientContext();

  // Verificar se está vendo como cliente
  if (isViewingAsClient) {
    console.log('Vendo como:', selectedClient.fullName);
  }
}
```

### 3. **Banner de Visualização**

Componente: `<ClientViewBanner />`

- Aparece automaticamente quando `isViewingAsClient === true`
- Mostra nome e email do cliente
- Botão "Voltar para Agência"
- Estilo dourado para destacar

### 4. **Modal de Adicionar Cliente**

**Campos**:
- Nome Completo
- Email (único)
- Senha Inicial

**Backend** (a implementar):
```bash
POST /api/clients
{
  "email": "cliente@example.com",
  "fullName": "Cliente Exemplo",
  "password": "senha123",
  "agency_id": <ID_DA_AGENCIA>
}
```

---

## 🔐 Fluxo de Uso

### Cenário: Agência quer ver dados de um cliente

1. **Agência faz login** (accessType: "agency")
2. **Vai em Clientes** (`/dashboard/clients`)
3. **Vê lista de clientes** da agência
4. **Clica em "Ver como"** no cliente desejado
5. **Banner dourado aparece** no topo
6. **Dashboard mostra dados DO CLIENTE**
7. **Agência navega** pelas páginas (Reports, Calendar, etc.)
8. **Tudo mostra dados do cliente selecionado**
9. **Clica em "Voltar para Agência"** no banner
10. **Volta para visão da agência**

---

## 🛠️ Como Usar no Código

### Exemplo 1: Mostrar Dados do Cliente Correto

```typescript
import { useClientContext } from '@/context/ClientContext';
import { useAuth } from '@/context/AuthContext';

function DashboardPage() {
  const { user } = useAuth();
  const { selectedClient, isViewingAsClient } = useClientContext();

  // Determinar qual usuário usar
  const currentUser = isViewingAsClient ? selectedClient : user;

  // Buscar dados do usuário correto
  const { data } = useApi(`/api/dashboard/${currentUser.id}`);

  return (
    <div>
      <h1>Dashboard de {currentUser.fullName}</h1>
      {/* ... */}
    </div>
  );
}
```

### Exemplo 2: Filtrar Dados por Usuário

```typescript
function ReportsPage() {
  const { user } = useAuth();
  const { selectedClient, isViewingAsClient } = useClientContext();

  const userId = isViewingAsClient ? selectedClient.id : user.id;

  useEffect(() => {
    // Busca relatórios do usuário correto
    fetch(`/api/reports?user_id=${userId}`)
      .then(res => res.json())
      .then(setReports);
  }, [userId]);
}
```

### Exemplo 3: Proteger Ações (Agência Não Pode Editar)

```typescript
function ContentPage() {
  const { isViewingAsClient } = useClientContext();

  return (
    <div>
      {/* Agência só pode VER, não EDITAR quando está "viewing as" */}
      <button disabled={isViewingAsClient}>
        {isViewingAsClient ? 'Somente Visualização' : 'Editar'}
      </button>
    </div>
  );
}
```

---

## 🗄️ Backend - Endpoints Necessários

### 1. Listar Clientes da Agência

```bash
GET /api/clients
Headers: Authorization: Bearer <token_agencia>

Response:
[
  {
    "id": "uuid",
    "email": "cliente@example.com",
    "fullName": "Cliente Exemplo",
    "accessType": "client",
    "agency_id": "uuid_agencia",
    "createdAt": "2024-01-15"
  }
]
```

### 2. Criar Cliente

```bash
POST /api/clients
Headers: Authorization: Bearer <token_agencia>
Body:
{
  "email": "novo@cliente.com",
  "fullName": "Novo Cliente",
  "password": "senha123"
}

Response:
{
  "id": "uuid",
  "email": "novo@cliente.com",
  "fullName": "Novo Cliente",
  "agency_id": "uuid_agencia"
}
```

### 3. Buscar Dados do Cliente (para View As)

```bash
GET /api/clients/:clientId/dashboard
Headers: Authorization: Bearer <token_agencia>

Response:
{
  "user": { ... },
  "stats": { ... },
  "reports": [ ... ]
}
```

---

## 📊 Schema de Banco de Dados

### Tabela: `users`

```sql
ALTER TABLE users
ADD COLUMN agency_id UUID REFERENCES users(id);

-- Índice para performance
CREATE INDEX idx_users_agency_id ON users(agency_id);
```

### Queries Úteis

```sql
-- Listar clientes de uma agência
SELECT * FROM users
WHERE agency_id = 'uuid_da_agencia'
AND access_type = 'client';

-- Verificar se agência pode acessar cliente
SELECT EXISTS(
  SELECT 1 FROM users
  WHERE id = 'uuid_cliente'
  AND agency_id = 'uuid_agencia'
);
```

---

## 🎨 UI/UX

### Banner de Visualização
- **Cor**: Dourado (gold gradient)
- **Posição**: Topo do dashboard, abaixo da sidebar
- **Conteúdo**:
  - Ícone de olho
  - "Visualizando como cliente"
  - Nome e email do cliente
  - Botão "Voltar para Agência"

### Página de Clientes
- **Cards de Stats**: Total, Ativos, Novos
- **Tabela**: Nome, Email, Data, Status, Ações
- **Botão "Ver como"**: Estilo dourado, destacado
- **Modal**: Clean, com validação de campos

---

## ✅ Checklist de Implementação

### Frontend (Feito)
- [x] Context `ClientContext` para gerenciar cliente selecionado
- [x] Hook `useClientContext`
- [x] Página `/dashboard/clients`
- [x] Componente `ClientViewBanner`
- [x] Modal de adicionar cliente
- [x] Integração com `DashboardLayout`
- [x] Traduções (EN/PT/ES)
- [x] Proteção de rota (apenas agências)

### Backend (A Fazer)
- [ ] Endpoint `GET /api/clients` (listar clientes da agência)
- [ ] Endpoint `POST /api/clients` (criar cliente)
- [ ] Endpoint `PUT /api/clients/:id` (editar cliente)
- [ ] Endpoint `DELETE /api/clients/:id` (excluir cliente)
- [ ] Middleware para verificar se agência pode acessar cliente
- [ ] Adicionar `agency_id` na tabela `users`
- [ ] Seeds para dados de teste

---

## 🧪 Testando

### 1. Criar Usuário de Agência

```bash
curl -X POST https://symponhy-backend-production.up.railway.app/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"agency@test.com\",\"password\":\"Agency123\",\"fullName\":\"Agencia Teste\",\"accessType\":\"agency\"}"
```

### 2. Login como Agência

```
Email: agency@test.com
Password: Agency123
```

### 3. Acessar Página de Clientes

```
URL: https://symponhy.vercel.app/dashboard/clients
```

### 4. Adicionar Cliente (Mock)

Clica em "Adicionar Cliente" e preenche:
- Nome: Cliente Teste
- Email: cliente@test.com
- Senha: Cliente123

### 5. Visualizar como Cliente

Clica em "Ver como" no cliente criado.

**Resultado esperado**:
- Banner dourado aparece
- Dashboard muda para contexto do cliente

---

## 🚀 Próximos Passos

1. **Implementar backend**:
   - Endpoints de clientes
   - Migration para `agency_id`
   - Middlewares de proteção

2. **Integrar dados reais**:
   - Substituir mock data
   - Conectar com API real

3. **Features adicionais**:
   - Busca/filtro de clientes
   - Paginação da tabela
   - Ordenação de colunas
   - Status (ativo/inativo)
   - Editar cliente
   - Excluir cliente

4. **Analytics**:
   - Gráfico de crescimento de clientes
   - Métricas agregadas de todos os clientes

---

## 💡 Boas Práticas

1. **Sempre verificar permissões no backend**
   - Frontend é apenas UI
   - Backend deve validar `agency_id`

2. **Logs de auditoria**
   - Registrar quando agência acessa dados de cliente
   - Compliance e segurança

3. **Cache inteligente**
   - Cache dados do cliente selecionado
   - Invalidar ao trocar de cliente

4. **Feedback visual**
   - Banner sempre visível quando "viewing as"
   - Cores diferenciadas

5. **Proteção de dados**
   - Agência não pode ver senha do cliente
   - Campos sensíveis devem ser mascarados

---

## 📝 Notas Importantes

- O sistema **NÃO faz login como cliente**
- É apenas **visualização de dados**
- A agência mantém sua própria sessão
- Útil para **suporte, análise e gestão**
- Cliente não sabe quando agência está vendo seus dados (considerar notificação)
