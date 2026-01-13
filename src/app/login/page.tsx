'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { FloatingOracle } from '@/components/chat/FloatingOracle';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSubmit = async (data: { email: string; password: string; accessType: string }) => {
    console.log('Login attempt:', data);
    // Redirect to dashboard after successful login
    console.log('Redirecionando para dashboard...');
    await router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-6 bg-slate-50">
      {/* Main Card Container */}
      <div className="bg-white w-full max-w-[1200px] rounded-[32px] shadow-2xl flex flex-col lg:flex-row overflow-hidden">

        {/* Left Column: Floating Oracle Sphere */}
        <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-slate-50 to-white items-center justify-center">
          <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-3xl scale-150" />
          <FloatingOracle size={420} />
        </div>

        {/* Right Column: Login Form */}
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
                  Bem-vindo ao
                </h1>
                <h2 className="text-2xl lg:text-3xl font-medium tracking-tight text-slate-900">
                  Symponhy
                </h2>
              </div>
            </div>

            {/* Form Component */}
            <LoginForm onSubmit={handleLoginSubmit} />

          </div>
        </div>
      </div>
    </div>
  );
}
