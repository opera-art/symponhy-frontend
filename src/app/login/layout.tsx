import { LanguageProvider } from '@/context/LanguageContext';

export const dynamic = 'force-dynamic';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
