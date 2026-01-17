import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ptBR } from '@clerk/localizations';
import { LanguageProvider } from '@/context/LanguageContext';
import { ClientProvider } from '@/context/ClientContext';
import { ChatContentProvider } from '@/context/ChatContentContext';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Violin - Social Media Dashboard',
  description: 'Gestao profissional de redes sociais com IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="pt-BR">
        <body className={inter.className}>
          <LanguageProvider>
            <ChatContentProvider>
              <ClientProvider>{children}</ClientProvider>
            </ChatContentProvider>
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
