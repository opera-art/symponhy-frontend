'use client';

import React, { useState, useMemo } from 'react';
import { Topbar } from '@/components/layout';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  Badge,
  Button,
  Input,
  Modal,
  ModalFooter,
} from '@/components/ui';
import { HarmoniaChat } from '@/components/content/HarmoniaChat';
import { YouTubeShortsTab } from '@/components/content/YouTubeShortsTab';
import { TikTokTab } from '@/components/content/TikTokTab';
import { ContentInteractionModal } from '@/components/content/ContentInteractionModal';
import { contents, scripts } from '@/data/calendarData';
import {
  Search,
  Grid3x3,
  List,
  CheckCircle,
  XCircle,
  Heart,
  MessageCircle,
  Bookmark,
  FileText,
  Clock,
  Play,
  Music,
  Image,
  Plus,
  Edit3,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

const ContentPage: React.FC = () => {
  const { t } = useLanguage();
  const [activePlatform, setActivePlatform] = useState('youtube');
  const [activeInstagramTab, setActiveInstagramTab] = useState('posts');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [showInteractionModal, setShowInteractionModal] = useState(false);

  const platformSections = useMemo(() => [
    {
      id: 'youtube',
      icon: Play,
      label: t('youtubeShorts'),
      description: t('youtubeShortsDescription'),
      color: 'from-red-50 to-rose-50',
      borderColor: 'border-red-200',
      logo: 'https://waryhub.com/files/preview/960x960/11767610313jrhof02aap4tz9sc5zd4jruev8rjau7kuv4wouxfagagliudlz5b2bh6gvqmrz29amwaflw2mumipqcbul5xibtd7dxyo7jr4pip.png',
    },
    {
      id: 'tiktok',
      icon: Music,
      label: t('tiktok'),
      description: t('tiktokDescription'),
      color: 'from-slate-50 to-slate-100',
      borderColor: 'border-slate-200',
      logo: 'https://static.vecteezy.com/system/resources/thumbnails/018/930/574/small/tiktok-logo-tikok-icon-transparent-tikok-app-logo-free-png.png',
    },
    {
      id: 'instagram',
      icon: Image,
      label: t('instagram'),
      description: t('instagramDescription'),
      color: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-200',
      logo: 'https://png.pngtree.com/png-clipart/20180626/ourmid/pngtree-instagram-icon-instagram-logo-png-image_3584853.png',
    },
  ], [t]);

  const instagramTabs = useMemo(() => [
    { id: 'posts', label: t('posts'), icon: '📷' },
    { id: 'carousel', label: t('carousel'), icon: '🔄' },
    { id: 'reels', label: t('reels'), icon: '🎬' },
    { id: 'stories', label: t('stories'), icon: '📱' },
  ], [t]);

  const instagramContents = contents.filter((c) => {
    if (activeInstagramTab === 'posts') return c.type === 'post';
    if (activeInstagramTab === 'carousel') return c.type === 'carousel';
    if (activeInstagramTab === 'reels') return c.type === 'reel';
    if (activeInstagramTab === 'stories') return c.type === 'story';
    return true;
  });

  const getTypeLabel = (type: string) => {
    const labels = {
      post: t('posts'),
      carousel: t('carousel'),
      reel: t('reels'),
      story: t('stories'),
    };
    return labels[type as keyof typeof labels];
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      post: '📷',
      carousel: '🔄',
      reel: '🎬',
      story: '📱',
    };
    return icons[type as keyof typeof icons];
  };

  return (
    <>
      <Topbar />

      {/* Header */}
      <div className="mb-4 animate-fade-in">
        <h2 className="text-2xl font-semibold text-slate-900 mb-1">
          {t('contentManager')}
        </h2>
        <p className="text-sm text-slate-500">
          {t('contentDescription')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 animate-fade-in">
        {/* Sidebar Navigation - Plataformas */}
        <div className="lg:col-span-1">
          <Card padding="md" className="sticky top-24 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 px-2">
              {t('platforms')}
            </h3>

            {platformSections.map((platform) => {
              const Icon = platform.icon;
              const isActive = activePlatform === platform.id;

              return (
                <button
                  key={platform.id}
                  onClick={() => {
                    setActivePlatform(platform.id);
                    if (platform.id === 'instagram') {
                      setActiveInstagramTab('posts');
                    }
                  }}
                  className={cn(
                    'w-full text-left p-3 rounded-lg transition-all',
                    isActive
                      ? 'bg-gold/10 border-l-4 border-l-gold'
                      : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <Icon
                      className={cn(
                        'w-5 h-5 flex-shrink-0 mt-0.5',
                        isActive ? 'text-gold' : 'text-slate-400'
                      )}
                    />
                    <div className="min-w-0">
                      <p
                        className={cn(
                          'text-sm font-medium leading-tight',
                          isActive ? 'text-slate-900' : 'text-slate-700'
                        )}
                      >
                        {platform.label}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* YOUTUBE SHORTS */}
          {activePlatform === 'youtube' && (
            <div className="animate-fade-in space-y-3">
              <Card padding="md" className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex-shrink-0 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src="https://waryhub.com/files/preview/960x960/11767610313jrhof02aap4tz9sc5zd4jruev8rjau7kuv4wouxfagagliudlz5b2bh6gvqmrz29amwaflw2mumipqcbul5xibtd7dxyo7jr4pip.png"
                      alt="YouTube"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {t('youtubeShorts')}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {t('youtubeShortsDescription')}
                    </p>
                  </div>
                </div>
              </Card>
              <YouTubeShortsTab />
            </div>
          )}

          {/* TIKTOK */}
          {activePlatform === 'tiktok' && (
            <div className="animate-fade-in space-y-3">
              <Card padding="md" className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex-shrink-0 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src="https://static.vecteezy.com/system/resources/thumbnails/018/930/574/small/tiktok-logo-tikok-icon-transparent-tikok-app-logo-free-png.png"
                      alt="TikTok"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {t('tiktok')}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {t('tiktokDescription')}
                    </p>
                  </div>
                </div>
              </Card>
              <TikTokTab
                onContentClick={(item) => {
                  setSelectedContent(item);
                  setShowInteractionModal(true);
                }}
              />
            </div>
          )}

          {/* INSTAGRAM */}
          {activePlatform === 'instagram' && (
            <div className="animate-fade-in space-y-3">
              <Card padding="md" className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex-shrink-0 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src="https://png.pngtree.com/png-clipart/20180626/ourmid/pngtree-instagram-icon-instagram-logo-png-image_3584853.png"
                      alt="Instagram"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {t('instagram')}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {t('instagramDescription')}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Instagram Tabs */}
              <Tabs value={activeInstagramTab} onValueChange={setActiveInstagramTab}>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <TabsList>
                    {instagramTabs.map((tab) => (
                      <TabsTrigger key={tab.id} value={tab.id}>
                        <span className="mr-1">{tab.icon}</span>
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <div className="flex items-center gap-2">
                    <Input
                      placeholder={t('searchPlaceholder')}
                      leftIcon={<Search className="w-4 h-4" />}
                      className="w-40"
                    />
                    <div className="flex bg-slate-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={cn(
                          'p-2 rounded transition-colors',
                          viewMode === 'grid'
                            ? 'bg-white shadow-sm'
                            : 'hover:bg-slate-200'
                        )}
                      >
                        <Grid3x3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                          'p-2 rounded transition-colors',
                          viewMode === 'list'
                            ? 'bg-white shadow-sm'
                            : 'hover:bg-slate-200'
                        )}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <TabsContent value="posts">
                  <InstagramContentGrid
                    items={instagramContents}
                    viewMode={viewMode}
                    onReject={() => setShowRejectionModal(true)}
                    type="post"
                    onContentClick={(item) => {
                      setSelectedContent(item);
                      setShowInteractionModal(true);
                    }}
                  />
                </TabsContent>

                <TabsContent value="carousel">
                  <InstagramContentGrid
                    items={instagramContents}
                    viewMode={viewMode}
                    onReject={() => setShowRejectionModal(true)}
                    type="carousel"
                    onContentClick={(item) => {
                      setSelectedContent(item);
                      setShowInteractionModal(true);
                    }}
                  />
                </TabsContent>

                <TabsContent value="reels">
                  <InstagramContentGrid
                    items={instagramContents}
                    viewMode={viewMode}
                    onReject={() => setShowRejectionModal(true)}
                    type="reel"
                    onContentClick={(item) => {
                      setSelectedContent(item);
                      setShowInteractionModal(true);
                    }}
                  />
                </TabsContent>

                <TabsContent value="stories">
                  <InstagramContentGrid
                    items={instagramContents}
                    viewMode={viewMode}
                    onReject={() => setShowRejectionModal(true)}
                    type="story"
                    onContentClick={(item) => {
                      setSelectedContent(item);
                      setShowInteractionModal(true);
                    }}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>

      {/* Harmonia Chat Assistant */}
      <HarmoniaChat />

      {/* Content Interaction Modal */}
      {selectedContent && (
        <ContentInteractionModal
          isOpen={showInteractionModal}
          onClose={() => {
            setShowInteractionModal(false);
            setSelectedContent(null);
          }}
          content={{
            id: selectedContent.id,
            title: selectedContent.title,
            thumbnail: selectedContent.thumbnail,
            type: selectedContent.type,
            status: selectedContent.status,
          }}
          onApprove={() => {
            console.log('Content approved:', selectedContent.id);
            setShowInteractionModal(false);
            setSelectedContent(null);
          }}
          onDeny={(reason) => {
            console.log('Content denied with reason:', reason, selectedContent.id);
            setShowInteractionModal(false);
            setSelectedContent(null);
          }}
          onEdit={() => {
            console.log('Edit content:', selectedContent.id);
            setShowInteractionModal(false);
            setSelectedContent(null);
          }}
        />
      )}

      {/* Rejection Modal */}
      <Modal
        isOpen={showRejectionModal}
        onClose={() => {
          setShowRejectionModal(false);
          setRejectionReason('');
        }}
        title="Motivo da Reprovação"
        description="Informe o motivo para ajudar na melhoria do conteúdo"
        size="md"
      >
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() =>
                setRejectionReason(
                  'Não está alinhado com a identidade de marca'
                )
              }
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-sm transition-colors"
            >
              Fora da identidade
            </button>
            <button
              onClick={() =>
                setRejectionReason('Precisa de mais informações')
              }
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-sm transition-colors"
            >
              Falta informação
            </button>
            <button
              onClick={() => setRejectionReason('Formato inadequado')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-sm transition-colors"
            >
              Formato errado
            </button>
          </div>

          <Input
            placeholder="Ou escreva um motivo personalizado..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full"
          />
        </div>

        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => {
              setShowRejectionModal(false);
              setRejectionReason('');
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            disabled={!rejectionReason.trim()}
          >
            Reprovar Conteúdo
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

interface InstagramContentGridProps {
  items: any[];
  viewMode: 'grid' | 'list';
  onReject: () => void;
  type: string;
  onContentClick?: (item: any) => void;
}

const InstagramContentGrid: React.FC<InstagramContentGridProps> = ({
  items,
  viewMode,
  onReject,
  type,
  onContentClick,
}) => {
  const { t } = useLanguage();

  const typeIcons = {
    post: '📷',
    carousel: '🔄',
    reel: '🎬',
    story: '📱',
  };

  const typeLabels = {
    post: t('posts'),
    carousel: t('carousel'),
    reel: t('reels'),
    story: t('stories'),
  };

  const filteredItems = items.filter((item) => item.type === type);

  if (filteredItems.length === 0) {
    return (
      <Card padding="lg" className="flex flex-col items-center justify-center py-12">
        <div className="text-4xl mb-4">
          {typeIcons[type as keyof typeof typeIcons]}
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          {t('noContent')} {typeLabels[type as keyof typeof typeLabels]}
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          {t('startAdding')}
        </p>
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          {t('new')} {typeLabels[type as keyof typeof typeLabels]}
        </Button>
      </Card>
    );
  }

  return (
    <div
      className={cn(
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'
          : 'space-y-3'
      )}
    >
      {filteredItems.map((item) => (
        <Card
          key={item.id}
          padding={viewMode === 'grid' ? 'none' : 'md'}
          hover
          onClick={() => onContentClick?.(item)}
          className={cn(
            viewMode === 'grid' ? 'overflow-hidden cursor-pointer' : 'flex gap-3 cursor-pointer'
          )}
        >
          {/* Grid View */}
          {viewMode === 'grid' && (
            <>
              <div className="aspect-video bg-slate-100 overflow-hidden relative group">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 text-xl opacity-80">
                  {typeIcons[item.type as keyof typeof typeIcons]}
                </div>

                {/* Status Badge */}
                <Badge
                  variant={
                    item.status === 'approved'
                      ? 'default'
                      : item.status === 'pending'
                        ? 'warning'
                        : 'error'
                  }
                  size="sm"
                  className="absolute bottom-2 left-2"
                >
                  {item.status === 'approved'
                    ? t('approved')
                    : item.status === 'pending'
                      ? t('pending')
                      : item.status === 'rejected'
                        ? t('rejected')
                        : t('draft')}
                </Badge>
              </div>

              <div className="p-3 space-y-2">
                <h4 className="font-semibold text-slate-900 text-sm line-clamp-2">
                  {item.title}
                </h4>

                {item.scheduledDate && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(item.scheduledDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}

                {item.metrics && (
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" />
                      {item.metrics.likes > 1000
                        ? `${(item.metrics.likes / 1000).toFixed(1)}k`
                        : item.metrics.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {item.metrics.comments > 1000
                        ? `${(item.metrics.comments / 1000).toFixed(1)}k`
                        : item.metrics.comments}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <>
              <div className="w-20 h-20 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 relative">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center text-2xl bg-black/20">
                  {typeIcons[item.type as keyof typeof typeIcons]}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-slate-800 text-sm">
                    {item.title}
                  </h4>
                  <Badge variant="default" size="sm" className="text-xs flex-shrink-0">
                    {item.status === 'approved'
                      ? t('approved')
                      : item.status === 'pending'
                        ? t('pending')
                        : t('draft')}
                  </Badge>
                </div>

                {item.caption && (
                  <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                    {item.caption}
                  </p>
                )}

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Edit3 className="w-3 h-3" />}
                  >
                    {t('edit')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Trash2 className="w-3 h-3" />}
                    className="text-status-error"
                  >
                    {t('remove')}
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ContentPage;
