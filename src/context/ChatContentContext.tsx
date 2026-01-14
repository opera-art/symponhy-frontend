'use client';

import React, { createContext, useContext, useState } from 'react';

interface PlanningDate {
  day: number;
  month: number;
  year: number;
  weekDay: string;
  formattedDate: string;
}

interface ChatContentContextType {
  isAddingContent: boolean;
  setIsAddingContent: (value: boolean) => void;
  onManualUpload: (() => void) | null;
  onCreateWithAgents: (() => void) | null;
  setCallbacks: (upload: () => void, agents: () => void) => void;
  // Planning mode
  isPlanningDay: boolean;
  setIsPlanningDay: (value: boolean) => void;
  planningDate: PlanningDate | null;
  setPlanningDate: (date: PlanningDate | null) => void;
}

const ChatContentContext = createContext<ChatContentContextType | undefined>(undefined);

export const ChatContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [onManualUpload, setOnManualUpload] = useState<(() => void) | null>(null);
  const [onCreateWithAgents, setOnCreateWithAgents] = useState<(() => void) | null>(null);
  // Planning mode state
  const [isPlanningDay, setIsPlanningDay] = useState(false);
  const [planningDate, setPlanningDate] = useState<PlanningDate | null>(null);

  const setCallbacks = (upload: () => void, agents: () => void) => {
    setOnManualUpload(() => upload);
    setOnCreateWithAgents(() => agents);
  };

  return (
    <ChatContentContext.Provider
      value={{
        isAddingContent,
        setIsAddingContent,
        onManualUpload,
        onCreateWithAgents,
        setCallbacks,
        isPlanningDay,
        setIsPlanningDay,
        planningDate,
        setPlanningDate,
      }}
    >
      {children}
    </ChatContentContext.Provider>
  );
};

export const useChatContent = () => {
  const context = useContext(ChatContentContext);
  if (!context) {
    throw new Error('useChatContent must be used within ChatContentProvider');
  }
  return context;
};
