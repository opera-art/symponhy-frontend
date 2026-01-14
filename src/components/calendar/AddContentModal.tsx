'use client';

import React, { useState } from 'react';
import { Upload, Zap, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { FloatingOracle } from '@/components/chat/FloatingOracle';

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
  const [showContent, setShowContent] = useState(false);
  const [spherePosition, setSpherePosition] = useState({ x: 0, y: 0 });
  const [sphereIntensity, setSphereIntensity] = useState(0.3);

  React.useEffect(() => {
    if (isOpen) {
      // Start with sphere at trigger position
      setSpherePosition(triggerPosition);
      setSphereIntensity(0.3);
      setShowContent(false);

      // Animate sphere to center
      const animationDuration = 600;
      const startTime = Date.now();
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);

        // Easing function
        const easeProgress = progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

        // Interpolate position
        setSpherePosition({
          x: triggerPosition.x + (centerX - triggerPosition.x) * easeProgress,
          y: triggerPosition.y + (centerY - triggerPosition.y) * easeProgress,
        });

        // Increase intensity
        setSphereIntensity(0.3 + easeProgress * 0.4);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Animation complete, show content
          setSpherePosition({ x: centerX, y: centerY });
          setSphereIntensity(0.7);
          setShowContent(true);
        }
      };

      animate();
    }
  }, [isOpen, triggerPosition]);

  if (!isOpen) return null;

  const handleClose = () => {
    setShowContent(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          showContent ? 'bg-black/30' : 'bg-black/0'
        }`}
        onClick={handleClose}
      />

      {/* Animated Sphere Container */}
      <div
        className="fixed z-50 pointer-events-none"
        style={{
          left: `${spherePosition.x}px`,
          top: `${spherePosition.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <FloatingOracle
          size={96}
          intensity={sphereIntensity}
          showOrbits={true}
        />
      </div>

      {/* Modal Content - Shows after sphere arrives at center */}
      {showContent && (
        <div className="fixed z-50 inset-0 flex items-center justify-center pointer-events-auto">
          <div
            className="bg-white rounded-3xl shadow-2xl shadow-slate-400/40 border border-slate-200 p-8 w-96 animate-fade-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sphere integrated into the top of the modal */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 pointer-events-none">
              <FloatingOracle
                size={80}
                intensity={0.8}
                showOrbits={true}
              />
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header with spacing for sphere */}
            <div className="text-center mb-8 mt-6">
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
      )}
    </>
  );
};
