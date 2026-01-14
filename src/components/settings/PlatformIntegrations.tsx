'use client';

import React, { useState } from 'react';
import { Card, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  Circle,
  Trash2,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { useLateProfile } from '@/hooks/useLateProfile';
import { Platform, LateAccount } from '@/services/lateService';

interface PlatformConfig {
  name: string;
  logoUrl: string;
  description: string;
  enabled: boolean;
}

const PLATFORM_CONFIG: Record<string, PlatformConfig> = {
  instagram: {
    name: 'Instagram',
    logoUrl:
      'https://png.pngtree.com/png-clipart/20180626/ourmid/pngtree-instagram-icon-instagram-logo-png-image_3584853.png',
    description: 'Gerencie reels, stories e posts do Instagram',
    enabled: true,
  },
  tiktok: {
    name: 'TikTok',
    logoUrl:
      'https://static.vecteezy.com/system/resources/thumbnails/018/930/574/small/tiktok-logo-tikok-icon-transparent-tikok-app-logo-free-png.png',
    description: 'Publique vídeos no TikTok',
    enabled: true,
  },
  youtube: {
    name: 'YouTube',
    logoUrl:
      'https://waryhub.com/files/preview/960x960/11767610313jrhof02aap4tz9sc5zd4jruev8rjau7kuv4wouxfagagliudlz5b2bh6gvqmrz29amwaflw2mumipqcbul5xibtd7dxyo7jr4pip.png',
    description: 'Publique vídeos e Shorts no YouTube',
    enabled: true,
  },
  linkedin: {
    name: 'LinkedIn',
    logoUrl:
      'https://cdn-icons-png.flaticon.com/512/174/174857.png',
    description: 'Publique posts e artigos no LinkedIn',
    enabled: true,
  },
  twitter: {
    name: 'X / Twitter',
    logoUrl:
      'https://cdn-icons-png.flaticon.com/512/5968/5968958.png',
    description: 'Publique tweets e threads',
    enabled: true,
  },
  facebook: {
    name: 'Facebook',
    logoUrl:
      'https://cdn-icons-png.flaticon.com/512/124/124010.png',
    description: 'Publique no Facebook',
    enabled: true,
  },
  threads: {
    name: 'Threads',
    logoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Threads_%28app%29.svg/2048px-Threads_%28app%29.svg.png',
    description: 'Publique no Threads',
    enabled: true,
  },
  pinterest: {
    name: 'Pinterest',
    logoUrl:
      'https://cdn-icons-png.flaticon.com/512/145/145808.png',
    description: 'Publique pins no Pinterest',
    enabled: true,
  },
};

// Plataformas em ordem de prioridade
const PLATFORM_ORDER: Platform[] = [
  'instagram',
  'tiktok',
  'youtube',
  'linkedin',
  'twitter',
  'facebook',
  'threads',
  'pinterest',
];

export const PlatformIntegrations: React.FC = () => {
  const {
    profile,
    accounts,
    isLoading,
    error,
    connectPlatform,
    disconnectAccount,
  } = useLateProfile();

  const [connectingPlatform, setConnectingPlatform] = useState<Platform | null>(null);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);

  const handleConnect = async (platform: Platform) => {
    try {
      setConnectingPlatform(platform);
      await connectPlatform(platform);
    } catch (err) {
      console.error('Error connecting:', err);
      alert('Erro ao conectar plataforma');
      setConnectingPlatform(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    if (!confirm('Tem certeza que deseja desconectar esta conta?')) return;

    try {
      setDisconnectingId(accountId);
      await disconnectAccount(accountId);
    } catch (err) {
      console.error('Error disconnecting:', err);
      alert('Erro ao desconectar conta');
    } finally {
      setDisconnectingId(null);
    }
  };

  const getAccountsForPlatform = (platform: Platform): LateAccount[] => {
    return accounts.filter((a) => a.platform === platform);
  };

  const renderPlatformCard = (platform: Platform) => {
    const config = PLATFORM_CONFIG[platform];
    if (!config) return null;

    const platformAccounts = getAccountsForPlatform(platform);
    const isConnected = platformAccounts.length > 0;
    const isConnecting = connectingPlatform === platform;

    return (
      <Card
        key={platform}
        padding="md"
        hover
        className={cn(
          'border-2 transition-all',
          isConnected
            ? 'border-green-200 bg-green-50/30'
            : 'border-slate-200',
          !config.enabled && 'opacity-60'
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 flex-shrink-0 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={config.logoUrl}
                alt={config.name}
                className="w-10 h-10 object-contain"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-slate-900">{config.name}</h4>
                {isConnected ? (
                  <Badge variant="success" size="sm">
                    <CheckCircle className="w-3 h-3" />
                    {platformAccounts.length} conta(s)
                  </Badge>
                ) : (
                  <Badge variant="default" size="sm">
                    <Circle className="w-3 h-3" />
                    Desconectado
                  </Badge>
                )}
              </div>

              <p className="text-xs text-slate-600 mb-3">{config.description}</p>

              {/* Contas conectadas */}
              {platformAccounts.length > 0 && (
                <div className="space-y-2">
                  {platformAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        {account.profilePictureUrl ? (
                          <img
                            src={account.profilePictureUrl}
                            alt={account.username || ''}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                            {(account.username || platform)[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {account.username ? `@${account.username}` : 'Conta conectada'}
                          </p>
                          {account.followersCount && (
                            <p className="text-xs text-slate-500">
                              {account.followersCount.toLocaleString('pt-BR')} seguidores
                            </p>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-shrink-0">
            <Button
              variant={isConnected ? 'outline' : 'primary'}
              size="sm"
              onClick={() => handleConnect(platform)}
              disabled={!config.enabled || isConnecting || isLoading}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Conectando...
                </>
              ) : !config.enabled ? (
                'Em breve'
              ) : isConnected ? (
                <>
                  <ExternalLink className="w-4 h-4 mr-1" />
                  + Adicionar
                </>
              ) : (
                'Conectar'
              )}
            </Button>
          </div>
        </div>
      </Card>
    );
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

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <span className="ml-2 text-slate-600">Carregando integrações...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {PLATFORM_ORDER.map((platform) => renderPlatformCard(platform))}
        </div>
      )}

      {/* Debug info - remover depois */}
      {profile && (
        <div className="mt-4 p-3 bg-slate-100 rounded-lg text-xs text-slate-500">
          <p>Profile ID: {profile._id || profile.id}</p>
          <p>Contas conectadas: {accounts.length}</p>
        </div>
      )}
    </div>
  );
};
