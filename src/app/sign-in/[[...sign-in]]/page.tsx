'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SignIn } from '@clerk/nextjs';
import { AnimatedViolin } from '@/shared/components/ui';

function SignInContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/dashboard';

  return (
    <div className="h-screen flex items-center justify-center p-4 lg:p-6 bg-slate-50 overflow-hidden">
      {/* Main Card Container */}
      <div className="bg-white w-full max-w-[1200px] h-[85vh] max-h-[700px] rounded-[32px] shadow-2xl flex flex-col lg:flex-row overflow-hidden">

        {/* Left Column: Animated Violin */}
        <div className="hidden lg:flex lg:w-[50%] relative bg-white items-center justify-center p-4 rounded-l-[32px] overflow-hidden">
          <AnimatedViolin />
        </div>

        {/* Right Column: Clerk Sign In */}
        <div className="lg:w-[50%] bg-white p-6 lg:p-12 flex flex-col justify-center w-full">
          <div className="w-full max-w-sm mx-auto lg:max-w-lg">

            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-slate-900">
                Sua criacao de conteudo, <span className="text-amber-500 italic">orquestrada.</span>
              </h1>
            </div>

            {/* Clerk SignIn Component */}
            <SignIn
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
              forceRedirectUrl={redirectUrl}
              signUpUrl="/sign-up"
            />

          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50">Carregando...</div>}>
      <SignInContent />
    </Suspense>
  );
}
