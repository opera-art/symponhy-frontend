'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { ClientViewBanner } from './ClientViewBanner';
import { FloatingChat } from '@/features/chat/components';
import { AgentsSidebar } from '@/shared/components/agents';
import { MobileNavProvider, useMobileNav } from '@/context/MobileNavContext';
import { useSetupCheck } from '@/shared/hooks/useSetupCheck';
import { CompanySetupModal } from '@/features/setup';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayoutContent: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isOpen, closeMobileNav } = useMobileNav();
  const { needsSetup, isLoading, completeSetup } = useSetupCheck();

  return (
    <div className="bg-background text-slate-600 antialiased min-h-screen flex selection:bg-gold/20 selection:text-slate-900">
      <Sidebar />

      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={isOpen} onClose={closeMobileNav} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Client View Banner - Shows when agency is viewing as client */}
        <ClientViewBanner />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-3 lg:p-5 scroll-smooth">
          {children}
        </main>
      </div>

      {/* Agents Orchestra Sidebar */}
      <AgentsSidebar />

      {/* Floating Chat with AI Assistant */}
      <FloatingChat />

      {/* Company Setup Modal - Shows when user needs to complete setup */}
      {!isLoading && (
        <CompanySetupModal
          isOpen={needsSetup}
          onComplete={completeSetup}
        />
      )}
    </div>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <MobileNavProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </MobileNavProvider>
  );
};

export { DashboardLayout };
