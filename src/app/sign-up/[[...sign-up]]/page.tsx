'use client';

import React, { Suspense } from 'react';
import { SignUp } from '@clerk/nextjs';
import { FloatingOracle } from '@/features/chat/components';

function SignUpContent() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-6 bg-slate-50">
      {/* Main Card Container */}
      <div className="bg-white w-full max-w-[1200px] rounded-[32px] shadow-2xl flex flex-col lg:flex-row overflow-hidden">

        {/* Left Column: Floating Oracle Sphere */}
        <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-slate-50 to-white items-center justify-center">
          <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-3xl scale-150" />
          <FloatingOracle size={420} />
        </div>

        {/* Right Column: Clerk Sign Up */}
        <div className="lg:w-[55%] bg-white p-6 lg:p-12 flex flex-col justify-center w-full">
          <div className="w-full max-w-sm mx-auto lg:max-w-lg">

            {/* Header */}
            <div className="flex items-start gap-4 mb-8">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=FFD700"
                alt="User Avatar"
                className="w-12 h-12 rounded-full bg-slate-100 shadow-sm flex-shrink-0"
              />
              <div>
                <h1 className="text-2xl lg:text-3xl font-medium tracking-tight text-slate-900">
                  Criar conta no
                </h1>
                <h2 className="text-2xl lg:text-3xl font-medium tracking-tight text-slate-900">
                  Symponhy
                </h2>
              </div>
            </div>

            {/* Clerk SignUp Component */}
            <SignUp
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-none border-0 w-full',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  socialButtonsBlockButton: 'border border-slate-200 hover:bg-slate-50',
                  formFieldInput: 'border-slate-300 focus:ring-slate-900 focus:border-slate-900',
                  formButtonPrimary: 'bg-slate-900 hover:bg-slate-800',
                  footerActionLink: 'text-slate-900 hover:text-slate-700',
                }
              }}
              forceRedirectUrl="/setup/company"
              signInUrl="/sign-in"
            />

          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50">Carregando...</div>}>
      <SignUpContent />
    </Suspense>
  );
}
