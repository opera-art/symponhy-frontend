import { NextRequest } from 'next/server';
import { handleOAuthCallback } from '@/modules/meta/presentation';

/**
 * GET /api/meta/callback
 * Callback do OAuth do Meta/Instagram
 */
export async function GET(request: NextRequest) {
  return handleOAuthCallback(request);
}
