'use client';

import React, { useState, useEffect } from 'react';
import { Topbar } from '@/components/layout';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useClientContext } from '@/context/ClientContext';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { ProtectedRoute } from '@/components/auth';
import {
  Users,
  Plus,
  Eye,
  Mail,
  Calendar,
  MoreVertical,
  Trash2,
  Edit,
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Client {
  id: string;
  email: string;
  fullName: string;
  accessType: string;
  createdAt: string;
  agency_id?: string;
}

const ClientsPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { setSelectedClient } = useClientContext();
  const router = useRouter();
  const { get } = useApi();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data for now (will connect to backend later)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setClients([
        {
          id: '1',
          email: 'cliente1@example.com',
          fullName: 'Cliente Exemplo 1',
          accessType: 'client',
          createdAt: '2024-01-15',
        },
        {
          id: '2',
          email: 'cliente2@example.com',
          fullName: 'Cliente Exemplo 2',
          accessType: 'client',
          createdAt: '2024-02-10',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleViewAsClient = (client: Client) => {
    setSelectedClient(client);
    router.push('/dashboard');
  };

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
                  {t('clients')}
                </h2>
                <p className="text-sm text-slate-500">
                  Gerencie seus clientes e acesse seus dashboards
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold/90 text-white rounded-xl transition-all duration-200 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Adicionar Cliente
              </button>
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
                  <p className="text-2xl font-semibold text-slate-900">{clients.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Novos este mês</p>
                  <p className="text-2xl font-semibold text-slate-900">2</p>
                </div>
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-gold" />
                </div>
              </div>
            </div>
          </div>

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
                      Data de Cadastro
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
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        {t('loading')}
                      </td>
                    </tr>
                  ) : clients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="w-12 h-12 text-slate-300" />
                          <p className="text-slate-500">Nenhum cliente cadastrado</p>
                          <button
                            onClick={() => setShowAddModal(true)}
                            className="mt-2 text-gold hover:underline text-sm"
                          >
                            Adicionar primeiro cliente
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    clients.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {client.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{client.fullName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="w-4 h-4" />
                            {client.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Ativo
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewAsClient(client)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 hover:bg-gold/20 text-gold rounded-lg transition-all duration-200 text-sm font-medium"
                            >
                              <Eye className="w-4 h-4" />
                              Ver como
                            </button>
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4 text-slate-400" />
                            </button>
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

        {/* Add Client Modal */}
        {showAddModal && (
          <AddClientModal onClose={() => setShowAddModal(false)} onSuccess={(newClient) => {
            setClients([...clients, newClient]);
            setShowAddModal(false);
          }} />
        )}
      </>
    </ProtectedRoute>
  );
};

// Add Client Modal Component
const AddClientModal: React.FC<{ onClose: () => void; onSuccess: (client: any) => void }> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newClient = {
        id: Math.random().toString(),
        email: formData.email,
        fullName: formData.fullName,
        accessType: 'client',
        createdAt: new Date().toISOString(),
      };
      onSuccess(newClient);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-xl font-semibold text-slate-900">Adicionar Novo Cliente</h3>
          <p className="text-sm text-slate-500 mt-1">Preencha os dados do cliente</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
              placeholder="João Silva"
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
              Senha Inicial
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
              placeholder="Mínimo 6 caracteres"
              minLength={6}
            />
            <p className="text-xs text-slate-500 mt-1">
              O cliente poderá alterar a senha no primeiro acesso
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gold hover:bg-gold/90 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientsPage;
