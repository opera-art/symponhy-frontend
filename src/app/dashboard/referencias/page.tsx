'use client';

import React, { useState } from 'react';
import { Topbar } from '@/components/layout';
import { Card, Badge, Button, Input, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { cn } from '@/lib/utils';
import { referencesData } from '@/data/newFeaturesData';
import {
  Search,
  Filter,
  Star,
  Zap,
  TrendingUp,
  Download,
  Share2,
  Copy,
  ArrowRight,
  Eye,
  MessageCircle,
  Heart,
  Bookmark,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const platformColors = {
  instagram: 'from-pink-500/20 to-rose-600/10',
  youtube: 'from-red-500/20 to-rose-600/10',
  tiktok: 'from-slate-500/20 to-slate-600/10',
};

const platformBadgeColors = {
  instagram: 'bg-gradient-to-r from-pink-500 to-rose-600',
  youtube: 'bg-gradient-to-r from-red-500 to-rose-600',
  tiktok: 'bg-gradient-to-r from-slate-600 to-slate-800',
};

export default function ReferencesPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReference, setSelectedReference] = useState(referencesData[0]);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState('overview');
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredReferences = referencesData.filter(
    (ref) =>
      ref.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const engagementRate =
    ((selectedReference.metrics.likes +
      selectedReference.metrics.comments +
      (selectedReference.metrics.saves || 0)) /
      selectedReference.metrics.views) *
    100;

  const performanceScore = Math.min(
    100,
    Math.round(
      (selectedReference.metrics.views / 1000 +
        selectedReference.metrics.likes / 10 +
        selectedReference.metrics.comments / 5) /
        3
    )
  );

  return (
    <>
      <Topbar />

      {/* Header */}
      <div className="mb-4 animate-fade-in">
        <h2 className="text-2xl font-semibold text-slate-900 mb-1">{t('referencesBase')}</h2>
        <p className="text-sm text-slate-500">
          {t('referencesDescription')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in">
        {/* Left: References List */}
        <div className="lg:col-span-1 space-y-3">
          <Input
            placeholder={t('searchReferences')}
            leftIcon={<Search className="w-4 h-4" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {filteredReferences.map((ref) => (
              <Card
                key={ref.id}
                padding="sm"
                hover
                className={cn(
                  'cursor-pointer transition-all border-2',
                  selectedReference.id === ref.id
                    ? 'border-gold bg-gold/5'
                    : 'border-slate-200 hover:border-slate-300'
                )}
                onClick={() => setSelectedReference(ref)}
              >
                <div className="flex gap-2">
                  {ref.thumbnail && (
                    <img
                      src={ref.thumbnail}
                      alt={ref.author}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-xs font-semibold text-slate-900 truncate">{ref.author}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(ref.id);
                        }}
                        className="flex-shrink-0"
                      >
                        <Star
                          className={cn(
                            'w-3 h-3',
                            favorites.includes(ref.id)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          )}
                        />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 truncate">{ref.description}</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="default" size="sm" className="text-xs bg-slate-200 text-slate-700">
                        {ref.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Detailed Analysis */}
        <div className="lg:col-span-2 space-y-3">
          <Card
            padding="md"
            className={cn(
              'relative overflow-hidden bg-gradient-to-br',
              platformColors[selectedReference.platform as keyof typeof platformColors]
            )}
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="default"
                      size="sm"
                      className={cn(
                        'text-white',
                        platformBadgeColors[selectedReference.platform as keyof typeof platformBadgeColors]
                      )}
                    >
                      {selectedReference.platform.toUpperCase()}
                    </Badge>
                    <Badge variant="default" size="sm" className="bg-slate-200 text-slate-900">
                      {selectedReference.type}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1">{selectedReference.author}</h4>
                  <p className="text-sm text-slate-600">{selectedReference.description}</p>
                </div>

                {selectedReference.avatar && (
                  <img
                    src={selectedReference.avatar}
                    alt={selectedReference.author}
                    className="w-12 h-12 rounded-full flex-shrink-0"
                  />
                )}
              </div>

              {/* Thumbnail */}
              {selectedReference.thumbnail && (
                <div className="w-full h-40 rounded-lg overflow-hidden bg-slate-200">
                  <img
                    src={selectedReference.thumbnail}
                    alt={selectedReference.author}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Copy Section */}
              <div className="bg-white/50 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-xs font-medium text-slate-600 mb-1">{t('copy')}</p>
                <p className="text-sm text-slate-900">{selectedReference.copy}</p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-white/50 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Heart className="w-3 h-3 text-rose-500" />
                  </div>
                  <p className="text-xs font-semibold text-slate-900">
                    {(selectedReference.metrics.likes / 1000).toFixed(1)}k
                  </p>
                  <p className="text-xs text-slate-500">{t('likes')}</p>
                </div>
                <div className="bg-white/50 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <MessageCircle className="w-3 h-3 text-blue-500" />
                  </div>
                  <p className="text-xs font-semibold text-slate-900">
                    {(selectedReference.metrics.comments / 1000).toFixed(1)}k
                  </p>
                  <p className="text-xs text-slate-500">{t('comments')}</p>
                </div>
                <div className="bg-white/50 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Eye className="w-3 h-3 text-purple-500" />
                  </div>
                  <p className="text-xs font-semibold text-slate-900">
                    {(selectedReference.metrics.views / 1000).toFixed(0)}k
                  </p>
                  <p className="text-xs text-slate-500">{t('views')}</p>
                </div>
                <div className="bg-white/50 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Bookmark className="w-3 h-3 text-amber-500" />
                  </div>
                  <p className="text-xs font-semibold text-slate-900">
                    {(selectedReference.metrics.saves || 0) / 100 > 0
                      ? `${Math.round((selectedReference.metrics.saves || 0) / 100)}`
                      : '0'}
                  </p>
                  <p className="text-xs text-slate-500">{t('saves')}</p>
                </div>
              </div>

              {/* Tags */}
              {selectedReference.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedReference.tags.map((tag) => (
                    <Badge key={tag} variant="default" size="sm" className="bg-slate-200 text-slate-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  leftIcon={<Zap className="w-4 h-4" />}
                >
                  {t('analyzeWithAI')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  leftIcon={<Copy className="w-4 h-4" />}
                >
                  {t('copyStrategy')}
                </Button>
              </div>
            </div>
          </Card>

          {/* Analysis Tabs */}
          <Tabs value={activeAnalysisTab} onValueChange={setActiveAnalysisTab}>
            <TabsList>
              <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
              <TabsTrigger value="insights">{t('insights')}</TabsTrigger>
              <TabsTrigger value="engagement">{t('engagement')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-3">
              <Card padding="md">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">{t('performanceScore')}</p>
                      <h4 className="text-2xl font-bold text-slate-900">{performanceScore}%</h4>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-amber-300/20 flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-gold" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{t('reach')}</span>
                      <span className="font-semibold text-slate-900">
                        {(selectedReference.metrics.views / 1000).toFixed(0)}k
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (selectedReference.metrics.views / 100000) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{t('engagementRate')}</span>
                      <span className="font-semibold text-slate-900">{engagementRate.toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                        style={{ width: `${Math.min(100, engagementRate * 10)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-3">
              <Card padding="md">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm mb-1">{t('strengths')}</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• {t('highReach')} {(selectedReference.metrics.views / 1000).toFixed(0)}k {t('viewsText')}</li>
                        <li>• {t('engagementAboveAverage')} ({engagementRate.toFixed(1)}%)</li>
                        <li>• {t('goodShares')} ({selectedReference.metrics.comments} {t('commentsText')})</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3 border-t border-slate-200">
                    <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm mb-1">{t('recommendations')}</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• {t('considerReusing')}</li>
                        <li>• {t('followTags')} "{selectedReference.tags[0]}" e "{selectedReference.tags[1]}"</li>
                        <li>• {t('studyCopy')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-3">
              <Card padding="md">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600 mb-1">{t('likes')}</p>
                      <h4 className="text-2xl font-bold text-rose-600">
                        {(selectedReference.metrics.likes / 1000).toFixed(1)}k
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {((selectedReference.metrics.likes / selectedReference.metrics.views) * 100).toFixed(2)}% {t('ofViews')}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600 mb-1">{t('comments')}</p>
                      <h4 className="text-2xl font-bold text-blue-600">
                        {(selectedReference.metrics.comments / 1000).toFixed(1)}k
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {((selectedReference.metrics.comments / selectedReference.metrics.views) * 100).toFixed(2)}% {t('ofViews')}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600 mb-1">{t('saves')}</p>
                      <h4 className="text-2xl font-bold text-amber-600">
                        {((selectedReference.metrics.saves || 0) / 100).toFixed(0)}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {(((selectedReference.metrics.saves || 0) / selectedReference.metrics.views) * 100).toFixed(2)}% {t('ofViews')}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600 mb-1">{t('views')}</p>
                      <h4 className="text-2xl font-bold text-purple-600">
                        {(selectedReference.metrics.views / 1000).toFixed(0)}k
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">{t('totalContent')}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
