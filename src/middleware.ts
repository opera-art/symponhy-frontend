import { NextRequest, NextResponse } from 'next/server';

// Decodifica JWT e verifica expiração (sem verificar assinatura - isso é feito no backend)
function isTokenValid(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));

    // Verifica se tem campo de expiração
    if (!payload.exp) return false;

    // Verifica se não expirou (exp é em segundos)
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return false;

    // Verifica campos obrigatórios
    if (!payload.userId || !payload.email) return false;

    return true;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas que não precisam de autenticação
  const publicRoutes = ['/login', '/register', '/'];

  const token = request.cookies.get('auth_token')?.value;
  const isValidToken = token ? isTokenValid(token) : false;

  // Se é uma rota pública, deixa passar
  if (publicRoutes.includes(pathname)) {
    // Se usuário está autenticado com token válido e tenta acessar login/register, redireciona para dashboard
    if (isValidToken && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Rotas protegidas (começam com /dashboard)
  if (pathname.startsWith('/dashboard')) {
    if (!token || !isValidToken) {
      // Sem token ou token inválido, limpa cookie e redireciona para login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
