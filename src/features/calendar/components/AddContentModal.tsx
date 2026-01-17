'use client';

import React, { useEffect } from 'react';
import { useChatContent } from '@/context/ChatContentContext';
import { useLanguage } from '@/context/LanguageContext';

interface AddContentModalProps {
  onManualUpload: () => void;
  onCreateWithAgents: () => void;
}

export const AddContentModal: React.FC<AddContentModalProps> = ({
  onManualUpload,
  onCreateWithAgents,
}) => {
  const { t } = useLanguage();
  const { isAddingContent, setIsAddingContent, setCallbacks } = useChatContent();

  useEffect(() => {
    setCallbacks(onManualUpload, onCreateWithAgents);
  }, [onManualUpload, onCreateWithAgents, setCallbacks]);

  // This component doesn't render anything directly
  // It just manages the state for FloatingChat to use
  return null;
};
