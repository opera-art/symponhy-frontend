import { NextRequest, NextResponse } from 'next/server';
import { createMetaUseCases } from '@/modules/meta/presentation';

/**
 * POST /api/meta/cron
 * Processa posts agendados que estão no horário
 *
 * Vercel Cron chama este endpoint automaticamente a cada minuto
 * Também aceita chamadas manuais com Authorization: Bearer {CRON_SECRET}
 */
export async function POST(request: NextRequest) {
  // Verificar autorização (Vercel Cron ou manual)
  const authHeader = request.headers.get('authorization');
  const vercelCronHeader = request.headers.get('x-vercel-cron');
  const cronSecret = process.env.CRON_SECRET;

  // Aceita: Vercel Cron interno OU token manual
  const isVercelCron = vercelCronHeader === '1';
  const isValidManualAuth = cronSecret && authHeader === `Bearer ${cronSecret}`;

  if (!isVercelCron && !isValidManualAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { processDuePosts } = createMetaUseCases();

    const result = await processDuePosts.execute();

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Cron job error:', error);

    return NextResponse.json(
      { error: 'Failed to process due posts' },
      { status: 500 }
    );
  }
}

// Também permite GET para testes manuais (apenas em desenvolvimento)
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  return POST(request);
}
