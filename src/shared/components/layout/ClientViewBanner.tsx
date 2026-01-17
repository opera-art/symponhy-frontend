'use client';

import React from 'react';
import { useClientContext } from '@/context/ClientContext';
import { Eye, X, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const ClientViewBanner: React.FC = () => {
  const { selectedClient, isViewingAsClient, clearClientView } = useClientContext();
  const router = useRouter();

  if (!isViewingAsClient || !selectedClient) {
    return null;
  }

  const handleBackToAgency = () => {
    clearClientView();
    router.push('/dashboard/clients');
  };

  return (
    <div className="bg-gradient-to-r from-gold to-yellow-600 text-white px-6 py-3 flex items-center justify-between shadow-md animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <Eye className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-medium">
            Visualizando como cliente
          </p>
          <p className="text-xs opacity-90">
            {selectedClient.fullName} ({selectedClient.email})
          </p>
        </div>
      </div>

      <button
        onClick={handleBackToAgency}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Agência
      </button>
    </div>
  );
};
