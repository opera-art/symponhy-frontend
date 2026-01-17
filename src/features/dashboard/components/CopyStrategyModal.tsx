'use client';

import React, { useState } from 'react';
import { Modal, ModalFooter, Button, Input, Badge, Card } from '@/shared/components/ui';
import { Reference } from '@/data/newFeaturesData';
import {
  Copy,
  Check,
  Zap,
  MessageCircle,
  Wand2,
} from 'lucide-react';

interface CopyStrategyModalProps {
  reference: Reference;
  isOpen: boolean;
  onClose: () => void;
  onCopy: (strategy: string) => void;
}

export const CopyStrategyModal: React.FC<CopyStrategyModalProps> = ({
  reference,
  isOpen,
  onClose,
  onCopy,
}) => {
  const [copyMode, setCopyMode] = useState<'exact' | 'adapt' | 'inspire'>('adapt');
  const [aiGenerated, setAiGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateAdaptedCopy = () => {
    return `${reference.copy}\n\n[IA adaptou este conteúdo para seu contexto]\n\nUse as hashtags:\n${reference.hashtags.join(' ')}\n\nTags sugeridas: ${reference.tags.join(', ')}`;
  };

  const getModeCopy = () => {
    if (copyMode === 'exact') {
      return reference.copy;
    } else if (copyMode === 'adapt') {
      return aiGenerated ? generateAdaptedCopy() : reference.copy;
    } else {
      return `Inspirado em: @${reference.author}\n\n${reference.description}\n\nAdapte este conteúdo para sua audiência com as tags: ${reference.tags.join(', ')}`;
    }
  };

  const handleCopy = () => {
    const text = getModeCopy();
    onCopy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Copiar Estratégia"
      description={`Baseado em: @${reference.author}`}
      size="lg"
    >
      <div className="space-y-4">
        {/* Mode Selection */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900">Modo de Cópia</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                id: 'exact',
                label: 'Cópia Exata',
                icon: Copy,
                description: 'Copiar exatamente como está',
              },
              {
                id: 'adapt',
                label: 'Adaptado',
                icon: Wand2,
                description: 'IA adapta para seu nicho',
              },
              {
                id: 'inspire',
                label: 'Inspirado',
                icon: Zap,
                description: 'Use como inspiração',
              },
            ].map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    setCopyMode(mode.id as 'exact' | 'adapt' | 'inspire');
                    setAiGenerated(false);
                  }}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    copyMode === mode.id
                      ? 'border-gold bg-gold/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-2 text-gold" />
                  <p className="text-xs font-semibold text-slate-900">{mode.label}</p>
                  <p className="text-xs text-slate-500">{mode.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Enhancement for Adapt Mode */}
        {copyMode === 'adapt' && (
          <div>
            <button
              onClick={() => setAiGenerated(!aiGenerated)}
              className={`w-full p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                aiGenerated
                  ? 'border-gold bg-gold/5'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Wand2 className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-slate-900">
                {aiGenerated ? 'Otimizado com IA' : 'Otimizar com IA (em breve)'}
              </span>
              {aiGenerated && <Check className="w-4 h-4 text-green-500 ml-auto" />}
            </button>
          </div>
        )}

        {/* Preview */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900">Pré-visualização</p>
          <Card padding="md" className="bg-slate-50 border-slate-200">
            <p className="text-sm text-slate-700 whitespace-pre-line line-clamp-6">
              {getModeCopy()}
            </p>
          </Card>
        </div>

        {/* Metadata */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900">Metadados do Conteúdo</p>
          <div className="grid grid-cols-2 gap-2">
            <Card padding="sm" className="bg-slate-50">
              <p className="text-xs text-slate-600 mb-1">Hashtags</p>
              <div className="flex flex-wrap gap-1">
                {reference.hashtags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="default" size="sm" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
            <Card padding="sm" className="bg-slate-50">
              <p className="text-xs text-slate-600 mb-1">Tags de Conteúdo</p>
              <div className="flex flex-wrap gap-1">
                {reference.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="info" size="sm" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Performance Tip */}
        <Card padding="sm" className="bg-amber-50 border-amber-200">
          <div className="flex gap-2">
            <MessageCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-900 mb-0.5">Dica de Performance</p>
              <p className="text-xs text-amber-700">
                Este conteúdo obteve {((reference.metrics.likes + reference.metrics.comments + (reference.metrics.saves || 0)) / reference.metrics.views * 100).toFixed(2)}% de taxa de engajamento. Adapte-o para sua audiência para melhores resultados!
              </p>
            </div>
          </div>
        </Card>
      </div>

      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          onClick={handleCopy}
        >
          {copied ? 'Copiado!' : 'Copiar Para Clipboard'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
