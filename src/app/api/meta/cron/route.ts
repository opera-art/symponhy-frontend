import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://symponhy-backend-production.up.railway.app';

/**
 * POST /api/meta/cron
 * Proxy para o backend - Processa posts agendados
 * Pode ser chamado pelo Vercel Cron ou manualmente
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autorização (Vercel Cron ou manual)
    const vercelCronHeader = request.headers.get('x-vercel-cron');
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Aceita: Vercel Cron interno OU token manual
    const isVercelCron = vercelCronHeader === '1';
    const isValidManualAuth = cronSecret && authHeader === `Bearer ${cronSecret}`;

    if (!isVercelCron && !isValidManualAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Chamar backend
    const response = await fetch(`${BACKEND_URL}/api/meta/cron`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cronSecret && { 'Authorization': `Bearer ${cronSecret}` }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Cron proxy error:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}

// GET para testes (apenas em dev)
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
  return POST(request);
}
