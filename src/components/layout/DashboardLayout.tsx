'use client';

import React from 'react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="bg-background text-slate-600 antialiased min-h-screen flex selection:bg-gold/20 selection:text-slate-900">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar p-3 lg:p-5 scroll-smooth">
        {children}
      </main>
    </div>
  );
};

export { DashboardLayout };
