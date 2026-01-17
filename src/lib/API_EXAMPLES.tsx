/**
 * 📚 EXEMPLOS DE USO DA API COM JWT REFRESH AUTOMÁTICO
 *
 * Este arquivo contém exemplos práticos de como usar o cliente API
 * com refresh automático de tokens no Symphony.
 */

import { useEffect, useState } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import api from '@/lib/api';

// ============================================================================
// EXEMPLO 1: Buscar lista de posts (usando hook)
// ============================================================================
export function PostsListExample() {
  const { data: posts, loading, error, get } = useApi();

  useEffect(() => {
    // O token é adicionado automaticamente
    // Se estiver expirando, faz refresh antes da requisição
    get('/api/posts');
  }, []);

  if (loading) return <div>Carregando posts...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h2>Posts</h2>
      {posts?.map((post: any) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXEMPLO 2: Criar novo post com callback de sucesso
// ============================================================================
export function CreatePostExample() {
  const { post, loading, error } = useApi({
    onSuccess: (data) => {
      console.log('✅ Post criado com sucesso:', data);
      alert('Post criado!');
    },
    onError: (error) => {
      console.error('❌ Erro ao criar post:', error);
      alert(`Erro: ${error}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await post('/api/posts', {
      title: formData.get('title'),
      content: formData.get('content'),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Título" required />
      <textarea name="content" placeholder="Conteúdo" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Criando...' : 'Criar Post'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

// ============================================================================
// EXEMPLO 3: Atualizar post existente
// ============================================================================
export function UpdatePostExample({ postId }: { postId: string }) {
  const { put, loading } = useApi();
  const [title, setTitle] = useState('');

  const handleUpdate = async () => {
    try {
      const updatedPost = await put(`/api/posts/${postId}`, { title });
      console.log('Post atualizado:', updatedPost);
    } catch (err) {
      console.error('Erro ao atualizar:', err);
    }
  };

  return (
    <div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Novo título"
      />
      <button onClick={handleUpdate} disabled={loading}>
        {loading ? 'Atualizando...' : 'Atualizar'}
      </button>
    </div>
  );
}

// ============================================================================
// EXEMPLO 4: Deletar post
// ============================================================================
export function DeletePostExample({ postId }: { postId: string }) {
  const { delete: deletePost, loading } = useApi();

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar?')) return;

    try {
      await deletePost(`/api/posts/${postId}`);
      console.log('Post deletado');
      // Redirecionar ou atualizar lista
    } catch (err) {
      console.error('Erro ao deletar:', err);
    }
  };

  return (
    <button onClick={handleDelete} disabled={loading}>
      {loading ? 'Deletando...' : 'Deletar'}
    </button>
  );
}

// ============================================================================
// EXEMPLO 5: Múltiplas requisições em sequência
// ============================================================================
export function SequentialRequestsExample() {
  const { get, post } = useApi();
  const [status, setStatus] = useState('');

  const handleMultipleRequests = async () => {
    try {
      setStatus('Buscando usuário...');
      const user = await get('/api/user/profile');

      setStatus('Buscando posts do usuário...');
      const posts = await get(`/api/users/${user.id}/posts`);

      setStatus('Criando novo post...');
      await post('/api/posts', {
        title: 'Novo post',
        userId: user.id,
      });

      setStatus('✅ Concluído!');
    } catch (err) {
      setStatus('❌ Erro na operação');
    }
  };

  return (
    <div>
      <button onClick={handleMultipleRequests}>
        Executar Requisições em Sequência
      </button>
      <p>Status: {status}</p>
    </div>
  );
}

// ============================================================================
// EXEMPLO 6: Upload de arquivo
// ============================================================================
export function FileUploadExample() {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // O interceptor adiciona o token automaticamente mesmo em FormData
      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Arquivo enviado:', response.data);
      alert('Upload concluído!');
    } catch (err) {
      console.error('Erro no upload:', err);
      alert('Erro ao fazer upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} disabled={uploading} />
      {uploading && <p>Enviando arquivo...</p>}
    </div>
  );
}

// ============================================================================
// EXEMPLO 7: Polling (requisições periódicas)
// ============================================================================
export function PollingExample() {
  const { data: stats, get } = useApi();

  useEffect(() => {
    // Buscar stats a cada 30 segundos
    const interval = setInterval(() => {
      get('/api/stats');
    }, 30000);

    // Buscar imediatamente ao montar
    get('/api/stats');

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3>Stats (atualiza a cada 30s)</h3>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
}

// ============================================================================
// EXEMPLO 8: Requisição sem autenticação (rotas públicas)
// ============================================================================
export function PublicRouteExample() {
  const { data, loading, get } = useApi();

  useEffect(() => {
    // Rotas públicas funcionam normalmente
    // Se não houver token, o interceptor apenas continua
    get('/api/public/posts');
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h3>Posts Públicos</h3>
      {data?.map((post: any) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}

// ============================================================================
// EXEMPLO 9: Usar API cliente diretamente (sem hook)
// ============================================================================
export async function directApiUsageExample() {
  try {
    // GET
    const posts = await api.get('/api/posts');
    console.log('Posts:', posts.data);

    // POST
    const newPost = await api.post('/api/posts', {
      title: 'Novo post',
      content: 'Conteúdo aqui',
    });
    console.log('Post criado:', newPost.data);

    // PUT
    const updated = await api.put('/api/posts/123', {
      title: 'Título atualizado',
    });
    console.log('Post atualizado:', updated.data);

    // DELETE
    await api.delete('/api/posts/123');
    console.log('Post deletado');

    // PATCH
    const patched = await api.patch('/api/posts/123', {
      published: true,
    });
    console.log('Post publicado:', patched.data);
  } catch (error) {
    console.error('Erro:', error);
  }
}

// ============================================================================
// EXEMPLO 10: Tratamento avançado de erros
// ============================================================================
export function AdvancedErrorHandlingExample() {
  const { post, error, loading } = useApi();

  const handleSubmit = async (data: any) => {
    try {
      await post('/api/posts', data);
    } catch (err: any) {
      // Erro específico do backend
      if (err.response?.status === 400) {
        console.log('Validação falhou:', err.response.data);
      }
      // Erro de rede
      else if (err.message === 'Network Error') {
        console.log('Sem conexão com internet');
      }
      // Token expirado (não deveria acontecer por causa do refresh)
      else if (err.response?.status === 401) {
        console.log('Autenticação falhou, redirecionando...');
        // O interceptor já vai redirecionar
      }
      // Outros erros
      else {
        console.log('Erro desconhecido:', err.message);
      }
    }
  };

  return (
    <div>
      <button onClick={() => handleSubmit({ title: 'Test' })}>
        Enviar
      </button>
      {loading && <p>Processando...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

// ============================================================================
// 💡 DICAS DE BOAS PRÁTICAS
// ============================================================================

/**
 * ✅ FAZER:
 * - Usar o hook useApi para componentes React
 * - Usar api direto para funções auxiliares
 * - Tratar erros específicos com try/catch
 * - Usar callbacks onSuccess/onError no hook
 *
 * ❌ NÃO FAZER:
 * - Adicionar token manualmente nos headers (já é feito automaticamente)
 * - Fazer refresh manual (é automático)
 * - Usar fetch() ao invés do cliente api (perde o refresh automático)
 * - Ignorar erros sem tratamento
 */

/**
 * 🔄 REFRESH AUTOMÁTICO:
 *
 * O token é renovado automaticamente quando:
 * 1. Está expirando em menos de 5 minutos (antes da requisição)
 * 2. Retorna erro 401 (depois da requisição, retenta)
 *
 * Você NÃO precisa:
 * - Chamar /auth/refresh manualmente
 * - Verificar expiração do token
 * - Gerenciar o estado do token
 * - Retentar requisições manualmente
 *
 * Tudo é AUTOMÁTICO! 🎉
 */
