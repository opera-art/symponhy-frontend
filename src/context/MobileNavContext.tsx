'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MobileNavContextType {
  isOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;
}

const MobileNavContext = createContext<MobileNavContextType | undefined>(undefined);

export const MobileNavProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openMobileNav = () => setIsOpen(true);
  const closeMobileNav = () => setIsOpen(false);
  const toggleMobileNav = () => setIsOpen(prev => !prev);

  return (
    <MobileNavContext.Provider value={{ isOpen, openMobileNav, closeMobileNav, toggleMobileNav }}>
      {children}
    </MobileNavContext.Provider>
  );
};

export const useMobileNav = (): MobileNavContextType => {
  const context = useContext(MobileNavContext);
  if (!context) {
    throw new Error('useMobileNav must be used within a MobileNavProvider');
  }
  return context;
};
