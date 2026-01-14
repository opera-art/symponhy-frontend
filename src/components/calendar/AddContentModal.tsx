'use client';

import React, { useState } from 'react';
import { Upload, Zap, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onManualUpload: () => void;
  onCreateWithAgents: () => void;
  triggerPosition?: { x: number; y: number };
}

export const AddContentModal: React.FC<AddContentModalProps> = ({
  isOpen,
  onClose,
  onManualUpload,
  onCreateWithAgents,
  triggerPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
}) => {
  const { t } = useLanguage();
  const [isAnimating, setIsAnimating] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isAnimating ? 'bg-black/30' : 'bg-black/0'
        }`}
        onClick={handleClose}
      />

      {/* Animated Sphere Container */}
      <div
        className={`fixed z-50 transition-all duration-500 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Expanding Sphere Background (Optional visual effect) */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl transition-all duration-500 ${
            isAnimating ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
          style={{
            width: '300px',
            height: '300px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Modal Content */}
        <div className="relative bg-white rounded-3xl shadow-2xl shadow-slate-400/40 border border-slate-200 p-8 w-96 backdrop-blur-sm">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {t('addNewContent') || 'Adicionar novo conteúdo'}
            </h2>
            <p className="text-sm text-slate-500">
              {t('chooseYourMethod') || 'Escolha como deseja criar seu conteúdo'}
            </p>
          </div>

          {/* Options Grid */}
          <div className="space-y-4">
            {/* Manual Upload Option */}
            <button
              onClick={() => {
                onManualUpload();
                handleClose();
              }}
              className="w-full group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-150 border border-blue-200 hover:border-blue-300 rounded-2xl p-6 transition-all duration-300 text-left"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/0 to-blue-400/0 group-hover:from-blue-400/5 group-hover:via-blue-400/10 group-hover:to-blue-400/0 transition-all duration-300" />

              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center group-hover:bg-blue-300 transition-colors flex-shrink-0 mt-1">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
                    {t('manualUpload') || 'Upload Manual'}
                  </h3>
                  <p className="text-xs text-slate-600 group-hover:text-slate-700 transition-colors">
                    {t('uploadContentDirectly') || 'Faça upload do seu conteúdo diretamente'}
                  </p>
                </div>
              </div>
            </button>

            {/* Create with Agents Option */}
            <button
              onClick={() => {
                onCreateWithAgents();
                handleClose();
              }}
              className="w-full group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-150 border border-purple-200 hover:border-purple-300 rounded-2xl p-6 transition-all duration-300 text-left"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/0 to-purple-400/0 group-hover:from-purple-400/5 group-hover:via-purple-400/10 group-hover:to-purple-400/0 transition-all duration-300" />

              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-200 flex items-center justify-center group-hover:bg-purple-300 transition-colors flex-shrink-0 mt-1">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-purple-700 transition-colors">
                    {t('createWithAgents') || 'Criar com Agentes'}
                  </h3>
                  <p className="text-xs text-slate-600 group-hover:text-slate-700 transition-colors">
                    {t('useAIAgents') || 'Use nossos agentes de IA para criar estratégias'}
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center">
              {t('youCanChangeAnytime') || 'Você pode mudar suas preferências a qualquer momento'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
