'use client';

import React, { useState } from 'react';
import { Topbar } from '@/components/layout';
import { Tabs, TabsList, TabsTrigger, TabsContent, Button, Badge, Card } from '@/components/ui';
import { BriefingSummary, ReferencesAnalysis, CompetitorAnalysis, ProfileAudit } from '@/features/briefing/components';
import {
  briefingData,
  referencesData,
  competitorData,
  auditData,
} from '@/data/mockData';
import { FileDown, Edit3, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const BriefingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handleExportPDF = () => {
    // PDF export logic here
    console.log('Exporting PDF...');
  };

  const handleEditBriefing = () => {
    // Navigate to form or open modal
    console.log('Edit briefing...');
  };

  return (
    <>
      <Topbar />

      {/* Header com Status */}
      <div className="mb-4 animate-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-1">{t('briefing')}</h2>
            <p className="text-sm text-slate-500">
              {t('briefingDescription')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" size="lg" dot>
              <CheckCircle className="w-4 h-4" />
              {t('briefingComplete')}
            </Badge>
            <Button
              variant="outline"
              size="md"
              leftIcon={<Edit3 className="w-4 h-4" />}
              onClick={handleEditBriefing}
            >
              {t('editBriefing')}
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<FileDown className="w-4 h-4" />}
              onClick={handleExportPDF}
            >
              {t('exportPDF')}
            </Button>
          </div>
        </div>
      </div>

      {/* Status Card */}
      <Card padding="sm" className="mb-4 bg-gradient-to-br from-gold/5 to-amber-50 border border-gold/20 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gold/20 text-gold flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm mb-0.5">
                {t('briefingCompleteUpdated')}
              </h4>
              <p className="text-xs text-slate-600">
                {t('lastUpdate')}: {new Date(briefingData.lastUpdate).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="animate-fade-in">
        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="summary">{t('summary')}</TabsTrigger>
            <TabsTrigger value="references">{t('references')}</TabsTrigger>
            <TabsTrigger value="competitors">{t('competitors')}</TabsTrigger>
            <TabsTrigger value="audit">{t('audit')}</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <BriefingSummary data={briefingData} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="references">
            <ReferencesAnalysis data={referencesData} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="competitors">
            <CompetitorAnalysis data={competitorData} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="audit">
            <ProfileAudit data={auditData} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default BriefingPage;
