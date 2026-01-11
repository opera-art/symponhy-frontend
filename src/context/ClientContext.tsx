'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Client {
  id: string;
  email: string;
  fullName: string;
  accessType: string;
  createdAt?: string;
  agency_id?: string;
}

interface ClientContextType {
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  isViewingAsClient: boolean;
  clearClientView: () => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const isViewingAsClient = selectedClient !== null;

  const clearClientView = () => {
    setSelectedClient(null);
  };

  return (
    <ClientContext.Provider
      value={{
        selectedClient,
        setSelectedClient,
        isViewingAsClient,
        clearClientView,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }
  return context;
};
