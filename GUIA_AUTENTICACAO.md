# 🔐 Guia de Autenticação - Symphony

Complete integration entre Frontend (Next.js) e Backend (Node.js + Supabase).

## 📁 Arquivos Criados

### Frontend (Next.js)
```
src/
├── context/
│   └── AuthContext.tsx              ← Context de autenticação com useAuth() hook
├── app/
│   ├── login/page.tsx               ← Página de login
│   ├── register/page.tsx            ← Página de registro
│   ├── layout.tsx                   ← Atualizado com AuthProvider
│   └── dashboard/
│       └── example-auth.tsx         ← Exemplo de uso do hook
├── middleware.ts                     ← Proteção de rotas
└── .env.local                        ← Variáveis de ambiente
```

## 🚀 Como Testar

### Passo 1: Inicie o Backend
```bash
cd c:\Users\jaian\Documents\symponhy-backend
npm run dev
```

Você verá:
```
🚀 Servidor rodando em http://localhost:3001
📡 CORS ativado para http://localhost:3002
🔐 Ambiente: development
```

### Passo 2: Inicie o Frontend
```bash
cd c:\Users\jaian\Documents\symponhy
npm run dev
```

Você verá:
```
- Local:        http://localhost:3002
```

### Passo 3: Teste a Autenticação

1. **Registro**: Acesse http://localhost:3002/register
   - Preencha: Nome, Email, Senha
   - Clique em "Criar Conta"
   - Você deve ser redirecionado para `/dashboard`

2. **Login**: Acesse http://localhost:3002/login
   - Email e senha do usuário criado
   - Clique em "Entrar"
   - Você deve ser redirecionado para `/dashboard`

3. **Logout**: No componente de autenticação
   - Clique em "Logout"
   - Você deve ser redirecionado para `/login`

## 🔌 Usando o Hook useAuth()

Em qualquer componente do dashboard:

```typescript
'use client';

import { useAuth } from '@/context/AuthContext';

export function MyComponent() {
  const { user, token, isAuthenticated, logout, loading, error } = useAuth();

  if (!isAuthenticated) {
    return <div>Não autenticado</div>;
  }

  return (
    <div>
      <h1>Bem-vindo, {user?.fullName}!</h1>
      <p>Email: {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 📊 Dados Disponíveis no Hook

```typescript
interface AuthContextType {
  user: User | null;              // { id, email, fullName }
  token: string | null;           // JWT token
  loading: boolean;               // Status de carregamento
  error: string | null;           // Mensagem de erro
  isAuthenticated: boolean;       // Se está autenticado

  // Funções
  login(email, password): Promise<void>;
  register(email, password, fullName): Promise<void>;
  logout(): void;
  clearError(): void;
}
```

## 🛡️ Proteção de Rotas

O middleware (`src/middleware.ts`) automaticamente:

- ✅ Redireciona usuários não autenticados para `/login`
- ✅ Redireciona usuários autenticados de `/login` para `/dashboard`
- ✅ Deixa rotas públicas (`/`, `/login`, `/register`) acessíveis
- ✅ Protege todas as rotas sob `/dashboard`

## 📡 Endpoints do Backend

### Registro
```bash
POST http://localhost:3001/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "senha123",
  "fullName": "Seu Nome"
}
```

**Resposta:**
```json
{
  "message": "Usuário registrado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "Seu Nome"
  }
}
```

### Login
```bash
POST http://localhost:3001/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "senha123"
}
```

### Perfil (Protegido)
```bash
GET http://localhost:3001/auth/me
Authorization: Bearer <token>
```

## 🔒 Fluxo de Autenticação

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                        │
├─────────────────────────────────────────────────────────────┤
│  1. Usuário acessa /register                                │
│  2. Preenche formulário (nome, email, senha)                │
│  3. Clica "Criar Conta"                                     │
│  4. AuthContext envia POST para backend                     │
│                           ↓                                 │
├─────────────────────────────────────────────────────────────┤
│              Backend (Node.js + Express)                    │
├─────────────────────────────────────────────────────────────┤
│  1. Recebe dados de registro                                │
│  2. Cria usuário no Supabase Auth                           │
│  3. Insere perfil na tabela "profiles"                      │
│  4. Gera JWT token                                          │
│  5. Retorna token + dados do usuário                        │
│                           ↓                                 │
├─────────────────────────────────────────────────────────────┤
│                   Frontend (Next.js)                        │
├─────────────────────────────────────────────────────────────┤
│  1. Recebe token e dados do usuário                         │
│  2. Salva no localStorage                                   │
│  3. Atualiza AuthContext                                    │
│  4. Redireciona para /dashboard                             │
│                                                             │
│  Usuário autenticado! ✅                                    │
└─────────────────────────────────────────────────────────────┘
```

## ⚙️ Configuração de Variáveis

**Backend** (`.env`):
```
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=...
FRONTEND_URL=http://localhost:3002
```

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## ✅ Checklist

- [x] Backend Node.js criado
- [x] Endpoints de autenticação implementados
- [x] JWT tokens gerados
- [x] Supabase conectado
- [x] Tabelas criadas
- [x] AuthContext implementado
- [x] Páginas de login/register criadas
- [x] Middleware de proteção implementado
- [x] Variáveis de ambiente configuradas
- [ ] Frontend rodando
- [ ] Backend rodando
- [ ] Teste de registro
- [ ] Teste de login
- [ ] Teste de logout

## 🐛 Troubleshooting

### "Network Error" no Login
- Verifique se o backend está rodando em `http://localhost:3001`
- Verifique se `NEXT_PUBLIC_API_URL` está correto em `.env.local`

### "Email já cadastrado"
- Use um email diferente ou registre um novo usuário

### Senha incorreta
- Digite a mesma senha usada no registro

### Token inválido/expirado
- Faça logout e login novamente
- O token expira em 7 dias

### "Could not find the table"
- Verifique se o SQL foi executado no Supabase

## 📚 Próximas Etapas

1. Integrar autenticação com APIs de conteúdo
2. Implementar refresh tokens
3. Adicionar 2FA (two-factor authentication)
4. Implementar rate limiting no backend
5. Adicionar validação de email

---

**Versão:** 1.0.0
**Última atualização:** 2026-01-11
**Status:** ✅ Pronto para uso
