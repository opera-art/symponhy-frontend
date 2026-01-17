'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Topbar } from '@/components/layout';
import { useLanguage } from '@/context/LanguageContext';
import { useOrganization } from '@clerk/nextjs';
import api from '@/lib/api';
import { ProtectedRoute } from '@/components/auth';
import {
  Users,
  Eye,
  Mail,
  MoreVertical,
  Trash2,
  AlertCircle,
  Loader2,
  Send,
  UserPlus,
  User
} from 'lucide-react';

interface Client {
  id: string;
  clerk_user_id?: string;
  clerk_org_id: string;
  name: string;
  email: string;
  phone?: string;
  company_name?: string;
  onboarding_type?: 'essential' | 'complete';
  onboarding_completed?: boolean;
  notes?: string;
  status: 'invited' | 'active' | 'inactive';
  created_at: string;
  updated_at?: string;
}

const ClientsPage: React.FC = () => {
  const { t } = useLanguage();
  const { organization, membership } = useOrganization();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Verificar se é admin (agência)
  const isAdmin = membership?.role === 'admin';

  // Fetch clients from API
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/clients');
      setClients(response.data || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao carregar clientes';
      setError(errorMessage);
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (organization) {
      fetchClients();
    }
  }, [fetchClients, organization]);

  // Remove client
  const handleRemoveClient = async (clientId: string) => {
    if (!confirm('Tem certeza que deseja remover este cliente? Ele perderá acesso à organização.')) {
      return;
    }

    try {
      setDeleteLoading(clientId);
      await api.delete(`/clients/${clientId}`);
      setClients(clients.filter(c => c.id !== clientId));
      setActiveDropdown(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao remover cliente';
      alert(errorMessage);
    } finally {
      setDeleteLoading(null);
    }
  };

  // Access client panel (impersonate)
  const handleAccessClient = async (client: Client) => {
    if (!client.clerk_user_id) {
      alert('Este cliente ainda não ativou sua conta.');
      return;
    }

    try {
      const response = await api.post(`/clients/${client.id}/impersonate`);
      // Open client panel in new tab
      window.open(response.data.url, '_blank');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao acessar painel do cliente';
      alert(errorMessage);
    }
  };

  // Count clients by status
  const activeCount = clients.filter(c => c.status === 'active').length;
  const invitedCount = clients.filter(c => c.status === 'invited').length;

  if (!organization) {
    return (
      <ProtectedRoute requiredPermission="canViewAllProjects">
        <Topbar />
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Organização não encontrada
            </h3>
            <p className="text-yellow-700">
              Você precisa criar ou participar de uma organização para gerenciar membros.
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredPermission="canViewAllProjects">
      <>
        <Topbar />

        <div className="p-6">
          {/* Header */}
          <div className="mb-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-1 flex items-center gap-2">
                  <Users className="w-6 h-6 text-gold" />
                  Clientes
                </h2>
                <p className="text-sm text-slate-500">
                  Gerencie os clientes de {organization.name}
                </p>
              </div>

              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold/90 text-white rounded-xl transition-all duration-200 shadow-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    Criar Cliente
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Total de Clientes</p>
                  <p className="text-2xl font-semibold text-slate-900">{clients.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Ativos</p>
                  <p className="text-2xl font-semibold text-slate-900">{activeCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Convidados</p>
                  <p className="text-2xl font-semibold text-slate-900">{invitedCount}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={fetchClients}
                className="ml-auto text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Clients Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-8 h-8 text-gold animate-spin" />
                          <p className="text-slate-500">{t('loading')}</p>
                        </div>
                      </td>
                    </tr>
                  ) : clients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="w-12 h-12 text-slate-300" />
                          <p className="text-slate-500">Nenhum cliente encontrado</p>
                          {isAdmin && (
                            <button
                              onClick={() => setShowCreateModal(true)}
                              className="mt-2 text-gold hover:underline text-sm"
                            >
                              Criar primeiro cliente
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    clients.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {client.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{client.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="w-4 h-4" />
                            {client.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-slate-600">{client.company_name || '-'}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            client.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : client.status === 'invited'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            {client.status === 'active' ? 'Ativo' : client.status === 'invited' ? 'Convidado' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isAdmin && client.clerk_user_id && (
                              <button
                                onClick={() => handleAccessClient(client)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 hover:bg-gold/20 text-gold rounded-lg transition-all duration-200 text-sm font-medium"
                              >
                                <Eye className="w-4 h-4" />
                                Acessar
                              </button>
                            )}
                            {isAdmin && (
                              <div className="relative">
                                <button
                                  onClick={() => setActiveDropdown(activeDropdown === client.id ? null : client.id)}
                                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                  <MoreVertical className="w-4 h-4 text-slate-400" />
                                </button>

                                {activeDropdown === client.id && (
                                  <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                                    <button
                                      onClick={() => handleRemoveClient(client.id)}
                                      disabled={deleteLoading === client.id}
                                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {deleteLoading === client.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-4 h-4" />
                                      )}
                                      Remover cliente
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <CreateClientModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={(newClient) => {
              setClients([newClient, ...clients]);
              setShowCreateModal(false);
            }}
          />
        )}
      </>
    </ProtectedRoute>
  );
};

// Create Client Modal - Cria cliente no Clerk + banco de dados
const CreateClientModal: React.FC<{ onClose: () => void; onSuccess: (client: Client) => void }> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Usa o endpoint /api/clients que cria no Clerk + profiles + clients
      const response = await api.post('/clients', formData);
      onSuccess(response.data.client);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error
        || err.response?.data?.errors?.[0]?.msg
        || 'Erro ao criar cliente';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-gold" />
            Criar Cliente
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Crie uma conta para o cliente da sua agencia
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
              placeholder="Joao Silva"
              minLength={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
              placeholder="joao@empresa.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Empresa do Cliente
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
              placeholder="Nome da empresa do cliente"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
              placeholder="Minimo 8 caracteres"
              minLength={8}
            />
            <p className="text-xs text-slate-500 mt-1">
              O cliente usara esta senha para fazer login
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gold hover:bg-gold/90 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Cliente'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientsPage;
