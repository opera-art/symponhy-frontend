'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Topbar } from '@/components/layout';
import { useLanguage } from '@/context/LanguageContext';
import { useOrganization } from '@clerk/nextjs';
import { useClientContext } from '@/context/ClientContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ProtectedRoute } from '@/components/auth';
import {
  Users,
  Plus,
  Eye,
  Mail,
  Calendar,
  MoreVertical,
  Trash2,
  UserCheck,
  AlertCircle,
  Loader2,
  Send,
  UserPlus,
  Shield,
  User
} from 'lucide-react';

interface Member {
  id: string;
  clerkUserId: string;
  email: string;
  fullName: string;
  role: 'admin' | 'member';
  avatarUrl?: string;
  createdAt: string;
}

const ClientsPage: React.FC = () => {
  const { t } = useLanguage();
  const { organization, membership } = useOrganization();
  const { setSelectedClient } = useClientContext();
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Verificar se é admin (agência)
  const isAdmin = membership?.role === 'admin';

  // Fetch members from API
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/members');
      setMembers(response.data || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao carregar membros';
      setError(errorMessage);
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (organization) {
      fetchMembers();
    }
  }, [fetchMembers, organization]);

  // Remove member
  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Tem certeza que deseja remover este membro? Ele perderá acesso à organização.')) {
      return;
    }

    try {
      setDeleteLoading(userId);
      await api.delete(`/members/${userId}`);
      setMembers(members.filter(m => m.clerkUserId !== userId));
      setActiveDropdown(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao remover membro';
      alert(errorMessage);
    } finally {
      setDeleteLoading(null);
    }
  };

  // View as member
  const handleViewAsMember = (member: Member) => {
    setSelectedClient({
      id: member.clerkUserId,
      email: member.email,
      fullName: member.fullName,
      accessType: member.role,
    });
    router.push('/dashboard');
  };

  // Contar membros por role
  const adminCount = members.filter(m => m.role === 'admin').length;
  const memberCount = members.filter(m => m.role === 'member').length;

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
                  Membros
                </h2>
                <p className="text-sm text-slate-500">
                  Gerencie os membros de {organization.name}
                </p>
              </div>

              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gold text-gold hover:bg-gold/10 rounded-xl transition-all duration-200"
                  >
                    <Send className="w-4 h-4" />
                    Convidar
                  </button>
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
                  <p className="text-sm text-slate-500 mb-1">Total de Membros</p>
                  <p className="text-2xl font-semibold text-slate-900">{members.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Administradores</p>
                  <p className="text-2xl font-semibold text-slate-900">{adminCount}</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Clientes</p>
                  <p className="text-2xl font-semibold text-slate-900">{memberCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
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
                onClick={fetchMembers}
                className="ml-auto text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Members Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Membro
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Função
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-8 h-8 text-gold animate-spin" />
                          <p className="text-slate-500">{t('loading')}</p>
                        </div>
                      </td>
                    </tr>
                  ) : members.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="w-12 h-12 text-slate-300" />
                          <p className="text-slate-500">Nenhum membro encontrado</p>
                          {isAdmin && (
                            <button
                              onClick={() => setShowInviteModal(true)}
                              className="mt-2 text-gold hover:underline text-sm"
                            >
                              Convidar primeiro membro
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    members.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {member.avatarUrl ? (
                              <img
                                src={member.avatarUrl}
                                alt={member.fullName}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {member.fullName?.charAt(0).toUpperCase() || '?'}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-slate-900">{member.fullName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="w-4 h-4" />
                            {member.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            member.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {member.role === 'admin' ? 'Administrador' : 'Cliente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isAdmin && member.role === 'member' && (
                              <button
                                onClick={() => handleViewAsMember(member)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 hover:bg-gold/20 text-gold rounded-lg transition-all duration-200 text-sm font-medium"
                              >
                                <Eye className="w-4 h-4" />
                                Ver como
                              </button>
                            )}
                            {isAdmin && (
                              <div className="relative">
                                <button
                                  onClick={() => setActiveDropdown(activeDropdown === member.id ? null : member.id)}
                                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                  <MoreVertical className="w-4 h-4 text-slate-400" />
                                </button>

                                {activeDropdown === member.id && (
                                  <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                                    <button
                                      onClick={() => handleRemoveMember(member.clerkUserId)}
                                      disabled={deleteLoading === member.clerkUserId || member.role === 'admin'}
                                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {deleteLoading === member.clerkUserId ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-4 h-4" />
                                      )}
                                      {member.role === 'admin' ? 'Não pode remover' : 'Remover membro'}
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

        {/* Invite Modal */}
        {showInviteModal && (
          <InviteMemberModal
            onClose={() => setShowInviteModal(false)}
            onSuccess={() => {
              setShowInviteModal(false);
              // Convite enviado - não precisa atualizar lista (usuário ainda não aceitou)
              alert('Convite enviado! O usuário receberá um email para aceitar.');
            }}
          />
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <CreateMemberModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={(newMember) => {
              setMembers([newMember, ...members]);
              setShowCreateModal(false);
            }}
          />
        )}
      </>
    </ProtectedRoute>
  );
};

// Invite Member Modal
const InviteMemberModal: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/members/invite', { email, role: 'member' });
      onSuccess();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao enviar convite';
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
            <Send className="w-5 h-5 text-gold" />
            Convidar Membro
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Envie um convite por email
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
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
              placeholder="cliente@empresa.com"
            />
            <p className="text-xs text-slate-500 mt-1">
              O usuário receberá um email para criar conta e aceitar o convite
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
                  Enviando...
                </>
              ) : (
                'Enviar Convite'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Create Client Modal - Cria cliente no Clerk + banco de dados
const CreateMemberModal: React.FC<{ onClose: () => void; onSuccess: (member: Member) => void }> = ({ onClose, onSuccess }) => {
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

      // Converte resposta do clients para formato de Member
      const client = response.data.client;
      const member: Member = {
        id: client.id,
        clerkUserId: client.clerk_user_id || client.id,
        email: client.email,
        fullName: client.name,
        role: 'member',
        createdAt: client.created_at,
      };

      onSuccess(member);
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
