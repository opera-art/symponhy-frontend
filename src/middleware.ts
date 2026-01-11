import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas que não precisam de autenticação
  const publicRoutes = ['/login', '/register', '/'];

  // Se é uma rota pública, deixa passar
  if (publicRoutes.includes(pathname)) {
    // Se usuário está autenticado e tenta acessar login/register, redireciona para dashboard
    const token = request.cookies.get('auth_token')?.value;
    if (token && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Rotas protegidas (começam com /dashboard)
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      // Sem token, redireciona para login
      return NextResponse.redirect(new URL('/login', request.url));
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
