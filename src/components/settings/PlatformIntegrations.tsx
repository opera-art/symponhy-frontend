'use client';

import React, { useState } from 'react';
import { Card, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, Copy, Trash2 } from 'lucide-react';

interface IntegrationPlatform {
  id: string;
  name: string;
  logo: string;
  logoUrl: string;
  description: string;
  isConnected: boolean;
  handle?: string;
  followers?: number;
  lastSync?: string;
}

const PLATFORMS: IntegrationPlatform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    logo: '📷',
    logoUrl: 'https://png.pngtree.com/png-clipart/20180626/ourmid/pngtree-instagram-icon-instagram-logo-png-image_3584853.png',
    description: 'Gerencie reels, stories e posts do Instagram',
    isConnected: true,
    handle: '@ana.marketing',
    followers: 15400,
    lastSync: '2024-01-10 às 14:30',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    logo: '🎵',
    logoUrl: 'https://static.vecteezy.com/system/resources/thumbnails/018/930/574/small/tiktok-logo-tikok-icon-transparent-tikok-app-logo-free-png.png',
    description: 'Publique vídeos no TikTok automaticamente',
    isConnected: false,
  },
  {
    id: 'youtube',
    name: 'YouTube Shorts',
    logo: '▶️',
    logoUrl: 'https://waryhub.com/files/preview/960x960/11767610313jrhof02aap4tz9sc5zd4jruev8rjau7kuv4wouxfagagliudlz5b2bh6gvqmrz29amwaflw2mumipqcbul5xibtd7dxyo7jr4pip.png',
    description: 'Integre com YouTube Shorts e gerencie shorts',
    isConnected: true,
    handle: '@AnaMarketing',
    followers: 8200,
    lastSync: '2024-01-10 às 15:45',
  },
];

export const PlatformIntegrations: React.FC = () => {
  const [platforms, setPlatforms] = useState<IntegrationPlatform[]>(PLATFORMS);

  const handleConnect = (id: string) => {
    setPlatforms(
      platforms.map((p) =>
        p.id === id ? { ...p, isConnected: !p.isConnected } : p
      )
    );
  };

  const handleDisconnect = (id: string) => {
    setPlatforms(
      platforms.map((p) =>
        p.id === id
          ? {
              ...p,
              isConnected: false,
              handle: undefined,
              followers: undefined,
              lastSync: undefined,
            }
          : p
      )
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

      <div className="grid grid-cols-1 gap-4">
        {platforms.map((platform) => (
          <Card
            key={platform.id}
            padding="md"
            hover
            className={cn(
              'border-2 transition-all',
              platform.isConnected
                ? 'border-green-200 bg-green-50/30'
                : 'border-slate-200'
            )}
          >
            <div className="flex items-start justify-between">
              {/* Left Side */}
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="w-16 h-16 flex-shrink-0 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={platform.logoUrl}
                    alt={platform.name}
                    className="w-12 h-12 object-contain"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-slate-900">
                      {platform.name}
                    </h4>
                    {platform.isConnected && (
                      <Badge variant="success" size="sm">
                        <CheckCircle className="w-3 h-3" />
                        Conectado
                      </Badge>
                    )}
                    {!platform.isConnected && (
                      <Badge variant="default" size="sm">
                        <Circle className="w-3 h-3" />
                        Desconectado
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mb-3">
                    {platform.description}
                  </p>

                  {/* Account Details */}
                  {platform.isConnected && platform.handle && (
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="text-slate-500 mb-0.5">Conta</p>
                        <p className="font-medium text-slate-900">
                          {platform.handle}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-0.5">Seguidores</p>
                        <p className="font-medium text-slate-900">
                          {platform.followers?.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-0.5">Última sincronização</p>
                        <p className="font-medium text-slate-900">
                          {platform.lastSync}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Actions */}
              <div className="flex gap-2 flex-shrink-0">
                {platform.isConnected && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Copy className="w-4 h-4" />}
                      onClick={() => handleConnect(platform.id)}
                    >
                      Re-sincronizar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-status-error hover:text-status-error"
                      leftIcon={<Trash2 className="w-4 h-4" />}
                      onClick={() => handleDisconnect(platform.id)}
                    >
                      Desconectar
                    </Button>
                  </>
                )}
                {!platform.isConnected && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleConnect(platform.id)}
                  >
                    Conectar
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
