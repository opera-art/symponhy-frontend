'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  Circle,
  RefreshCw,
  Trash2,
  Loader2,
  AlertCircle,
} from 'lucide-react';

// Tipos para contas do Meta
interface MetaConnectedAccount {
  id: string;
  igUserId: string;
  username: string;
  profilePictureUrl?: string;
  followersCount?: number;
  accountType: 'BUSINESS' | 'CREATOR';
  pageName?: string;
  isActive: boolean;
  tokenStatus: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';
  connectedAt: string;
}

interface IntegrationPlatform {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  isConnected: boolean;
  accounts: MetaConnectedAccount[];
  isLoading?: boolean;
}

const PLATFORM_CONFIG = {
  instagram: {
    name: 'Instagram',
    logoUrl:
      'https://png.pngtree.com/png-clipart/20180626/ourmid/pngtree-instagram-icon-instagram-logo-png-image_3584853.png',
    description: 'Gerencie reels, stories e posts do Instagram',
  },
  tiktok: {
    name: 'TikTok',
    logoUrl:
      'https://static.vecteezy.com/system/resources/thumbnails/018/930/574/small/tiktok-logo-tikok-icon-transparent-tikok-app-logo-free-png.png',
    description: 'Publique vídeos no TikTok automaticamente (em breve)',
  },
  youtube: {
    name: 'YouTube Shorts',
    logoUrl:
      'https://waryhub.com/files/preview/960x960/11767610313jrhof02aap4tz9sc5zd4jruev8rjau7kuv4wouxfagagliudlz5b2bh6gvqmrz29amwaflw2mumipqcbul5xibtd7dxyo7jr4pip.png',
    description: 'Integre com YouTube Shorts (em breve)',
  },
};

export const PlatformIntegrations: React.FC = () => {
  const [instagramAccounts, setInstagramAccounts] = useState<MetaConnectedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Carregar contas conectadas
  const loadAccounts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/meta/accounts');

      if (!response.ok) {
        throw new Error('Falha ao carregar contas');
      }

      const data = await response.json();
      setInstagramAccounts(data.accounts || []);
    } catch (err) {
      console.error('Error loading accounts:', err);
      setError('Não foi possível carregar as contas conectadas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();

    // Verificar se voltou do OAuth com sucesso ou erro
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const errorParam = params.get('error');
    const message = params.get('message');

    if (success === 'true' && message) {
      // Mostrar mensagem de sucesso (você pode usar um toast aqui)
      alert(decodeURIComponent(message));
      // Limpar URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (errorParam) {
      setError(message ? decodeURIComponent(message) : 'Erro ao conectar conta');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Conectar Instagram
  const handleConnectInstagram = () => {
    setIsConnecting(true);
    // Redireciona para o OAuth
    window.location.href = '/api/meta/auth?redirect=/dashboard/settings';
  };

  // Desconectar conta
  const handleDisconnect = async (accountId: string) => {
    if (!confirm('Tem certeza que deseja desconectar esta conta?')) return;

    try {
      setDisconnectingId(accountId);
      const response = await fetch(`/api/meta/accounts/${accountId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Falha ao desconectar');
      }

      // Remover da lista
      setInstagramAccounts((accounts) =>
        accounts.filter((a) => a.id !== accountId)
      );
    } catch (err) {
      console.error('Error disconnecting:', err);
      alert('Erro ao desconectar conta');
    } finally {
      setDisconnectingId(null);
    }
  };

  // Renovar token
  const handleRefreshToken = async (accountId: string) => {
    try {
      setRefreshingId(accountId);
      const response = await fetch(`/api/meta/accounts/${accountId}/refresh`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Falha ao renovar token');
      }

      // Recarregar contas
      await loadAccounts();
    } catch (err) {
      console.error('Error refreshing token:', err);
      alert('Erro ao renovar token');
    } finally {
      setRefreshingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTokenStatusBadge = (status: MetaConnectedAccount['tokenStatus']) => {
    switch (status) {
      case 'VALID':
        return (
          <Badge variant="success" size="sm">
            Token válido
          </Badge>
        );
      case 'EXPIRING_SOON':
        return (
          <Badge variant="warning" size="sm">
            <AlertCircle className="w-3 h-3 mr-1" />
            Expirando em breve
          </Badge>
        );
      case 'EXPIRED':
        return (
          <Badge variant="error" size="sm">
            Token expirado
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Integrações com Plataformas
        </h3>
        <p className="text-sm text-slate-600">
          Conecte suas contas nas principais plataformas de redes sociais
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {/* Instagram Card */}
        <Card
          padding="md"
          hover
          className={cn(
            'border-2 transition-all',
            instagramAccounts.length > 0
              ? 'border-green-200 bg-green-50/30'
              : 'border-slate-200'
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 flex-shrink-0 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={PLATFORM_CONFIG.instagram.logoUrl}
                  alt="Instagram"
                  className="w-12 h-12 object-contain"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-slate-900">
                    {PLATFORM_CONFIG.instagram.name}
                  </h4>
                  {instagramAccounts.length > 0 ? (
                    <Badge variant="success" size="sm">
                      <CheckCircle className="w-3 h-3" />
                      {instagramAccounts.length} conta(s)
                    </Badge>
                  ) : (
                    <Badge variant="default" size="sm">
                      <Circle className="w-3 h-3" />
                      Desconectado
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-slate-600 mb-3">
                  {PLATFORM_CONFIG.instagram.description}
                </p>

                {/* Contas conectadas */}
                {isLoading ? (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Carregando contas...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {instagramAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200"
                      >
                        <div className="flex items-center gap-3">
                          {account.profilePictureUrl ? (
                            <img
                              src={account.profilePictureUrl}
                              alt={account.username}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                              {account.username[0].toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-slate-900">
                              @{account.username}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span>
                                {account.followersCount?.toLocaleString('pt-BR')}{' '}
                                seguidores
                              </span>
                              <span>•</span>
                              <span>{account.accountType}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {getTokenStatusBadge(account.tokenStatus)}

                          {account.tokenStatus !== 'VALID' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRefreshToken(account.id)}
                              disabled={refreshingId === account.id}
                            >
                              {refreshingId === account.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <RefreshCw className="w-4 h-4" />
                              )}
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDisconnect(account.id)}
                            disabled={disconnectingId === account.id}
                          >
                            {disconnectingId === account.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-shrink-0">
              <Button
                variant={instagramAccounts.length > 0 ? 'outline' : 'primary'}
                size="sm"
                onClick={handleConnectInstagram}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Conectando...
                  </>
                ) : instagramAccounts.length > 0 ? (
                  '+ Adicionar conta'
                ) : (
                  'Conectar'
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* TikTok Card - Em breve */}
        <Card padding="md" className="border-2 border-slate-200 opacity-60">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 flex-shrink-0 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={PLATFORM_CONFIG.tiktok.logoUrl}
                  alt="TikTok"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-slate-900">
                    {PLATFORM_CONFIG.tiktok.name}
                  </h4>
                  <Badge variant="default" size="sm">
                    Em breve
                  </Badge>
                </div>
                <p className="text-xs text-slate-600">
                  {PLATFORM_CONFIG.tiktok.description}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled>
              Em breve
            </Button>
          </div>
        </Card>

        {/* YouTube Card - Em breve */}
        <Card padding="md" className="border-2 border-slate-200 opacity-60">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 flex-shrink-0 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={PLATFORM_CONFIG.youtube.logoUrl}
                  alt="YouTube"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-slate-900">
                    {PLATFORM_CONFIG.youtube.name}
                  </h4>
                  <Badge variant="default" size="sm">
                    Em breve
                  </Badge>
                </div>
                <p className="text-xs text-slate-600">
                  {PLATFORM_CONFIG.youtube.description}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled>
              Em breve
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
