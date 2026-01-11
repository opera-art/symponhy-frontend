# 🚀 API Client com JWT Refresh Automático

Sistema de autenticação JWT com refresh automático de tokens implementado no Symphony.

## 🎯 Funcionamento

### Refresh Automático
O sistema verifica automaticamente se o token está expirando **antes de cada requisição**:
- Se o token vai expirar em **menos de 5 minutos** → Faz refresh automático
- Se o token já expirou e retorna **401** → Faz refresh e retenta a requisição
- Se o refresh falhar → Redireciona para login

### Vantagens
✅ Usuário **nunca é deslogado** enquanto usa o app
✅ **Transparente** - não precisa gerenciar tokens manualmente
✅ **Otimizado** - evita múltiplos refreshes simultâneos
✅ **Type-safe** - TypeScript em todos os lugares

## 📦 Como Usar

### Opção 1: Hook useApi (Recomendado)

```typescript
import { useApi } from '@/hooks/useApi';

function MyComponent() {
  const { data, loading, error, get, post } = useApi();

  // GET request
  const fetchData = async () => {
    try {
      const result = await get('/api/posts');
      console.log(result);
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  // POST request
  const createPost = async (postData) => {
    try {
      const newPost = await post('/api/posts', postData);
      console.log('Post criado:', newPost);
    } catch (err) {
      console.error('Erro ao criar:', err);
    }
  };

  return (
    <div>
      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

### Opção 2: Cliente Axios Direto

```typescript
import api from '@/lib/api';

// GET
const getPosts = async () => {
  const response = await api.get('/api/posts');
  return response.data;
};

// POST
const createPost = async (data) => {
  const response = await api.post('/api/posts', data);
  return response.data;
};

// PUT
const updatePost = async (id, data) => {
  const response = await api.put(`/api/posts/${id}`, data);
  return response.data;
};

// DELETE
const deletePost = async (id) => {
  const response = await api.delete(`/api/posts/${id}`);
  return response.data;
};
```

## 🔐 Autenticação

O token JWT é **adicionado automaticamente** em todas as requisições:

```typescript
// ❌ Não precisa fazer isso
api.get('/api/posts', {
  headers: { Authorization: `Bearer ${token}` }
});

// ✅ O interceptor adiciona automaticamente
api.get('/api/posts');
```

## 🔄 Fluxo de Refresh

```
Requisição → Verificar token
    ↓
Token expirando? (< 5 min)
    ↓
   SIM → Fazer refresh
    ↓
Atualizar localStorage
    ↓
Adicionar novo token ao header
    ↓
Fazer requisição original
```

## 🛡️ Tratamento de Erros

### Erro 401 (Token Inválido)
```typescript
// Automático: Tenta refresh e retenta a requisição
api.get('/api/protected-route')
  .then(data => console.log(data))
  .catch(err => {
    // Se chegar aqui, o refresh falhou
    // Usuário será redirecionado para /login
  });
```

### Outros Erros
```typescript
try {
  await api.post('/api/posts', invalidData);
} catch (error) {
  if (error.response?.status === 400) {
    console.log('Dados inválidos');
  } else if (error.response?.status === 404) {
    console.log('Não encontrado');
  } else {
    console.log('Erro desconhecido');
  }
}
```

## 📝 Exemplos Práticos

### Buscar Posts do Usuário
```typescript
import { useApi } from '@/hooks/useApi';

function PostsList() {
  const { data: posts, loading, get } = useApi();

  useEffect(() => {
    get('/api/posts');
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      {posts?.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### Criar Novo Post
```typescript
function CreatePost() {
  const { post, loading, error } = useApi({
    onSuccess: (data) => {
      toast.success('Post criado!');
      router.push(`/posts/${data.id}`);
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  const handleSubmit = async (formData) => {
    await post('/api/posts', formData);
  };

  return <PostForm onSubmit={handleSubmit} loading={loading} />;
}
```

### Atualizar Perfil
```typescript
function ProfileSettings() {
  const { put, loading } = useApi();

  const updateProfile = async (data) => {
    try {
      await put('/api/profile', data);
      toast.success('Perfil atualizado!');
    } catch (err) {
      toast.error('Erro ao atualizar');
    }
  };

  return <ProfileForm onSubmit={updateProfile} loading={loading} />;
}
```

## 🧪 Testes

### Testar Refresh Manual
```typescript
import api from '@/lib/api';

// Forçar refresh (para testes)
const testRefresh = async () => {
  try {
    const response = await api.post('/auth/refresh');
    console.log('Novo token:', response.data.token);
  } catch (error) {
    console.error('Refresh falhou:', error);
  }
};
```

## 🔧 Configuração

### Variáveis de Ambiente
```env
NEXT_PUBLIC_API_URL=https://seu-backend.railway.app
```

### Timeout
Por padrão: **10 segundos**

Para alterar:
```typescript
// src/lib/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000, // 30 segundos
});
```

## 🚨 Troubleshooting

### Token não está sendo adicionado
- Verificar se o token está no localStorage: `localStorage.getItem('auth_token')`
- Verificar se a rota precisa de autenticação

### Refresh em loop infinito
- Backend pode estar retornando 401 no endpoint de refresh
- Verificar se o endpoint `/auth/refresh` existe e funciona

### Usuário sendo deslogado
- Token pode estar realmente inválido no backend
- Verificar logs do Railway para ver se há erro na validação

## 📊 Monitoramento

### Logs do Interceptor
Para debug, adicione logs no arquivo `src/lib/api.ts`:

```typescript
api.interceptors.request.use(async (config) => {
  console.log('📤 Request:', config.method?.toUpperCase(), config.url);
  // ... resto do código
});

api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error:', error.response?.status, error.config?.url);
    // ... resto do código
  }
);
```

## 🎓 Referências

- **Arquivo Principal**: [src/lib/api.ts](./api.ts)
- **Hook**: [src/hooks/useApi.ts](../hooks/useApi.ts)
- **Context**: [src/context/AuthContext.tsx](../context/AuthContext.tsx)
