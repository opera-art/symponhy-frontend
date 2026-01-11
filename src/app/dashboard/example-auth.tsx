'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

/**
 * Exemplo de como usar a autenticação em um componente
 * 
 * Importe e use o hook useAuth() para acessar:
 * - user: Dados do usuário autenticado
 * - token: JWT token
 * - isAuthenticated: Se está autenticado
 * - logout: Função para fazer logout
 * - login, register: Funções de autenticação
 */
export function AuthExample() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return <div>Não autenticado</div>;
  }

  return (
    <div className="flex items-center gap-4">
      <div>
        <p className="text-sm text-slate-600">Bem-vindo</p>
        <p className="font-semibold text-slate-900">{user?.fullName}</p>
        <p className="text-xs text-slate-500">{user?.email}</p>
      </div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
