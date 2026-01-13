import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, getUserIdFromToken } from '@/lib/supabase/server';
import { SaveProgressPayload, OnboardingProgress, ApiResponse } from '@/types/onboarding';

// GET /api/onboarding/progress - Obter progresso do usuário
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken();

    if (!userId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Usuário não autenticado',
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'essential' | 'complete' | null;

    const supabase = createServerClient();

    let query = supabase
      .from('onboarding_progress')
      .select('*')
      .eq('user_id', userId);

    if (type) {
      query = query.eq('onboarding_type', type);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching progress:', error);
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Erro ao buscar progresso',
      }, { status: 500 });
    }

    return NextResponse.json<ApiResponse<OnboardingProgress[]>>({
      success: true,
      data: data || [],
    });

  } catch (error) {
    console.error('Error in GET /api/onboarding/progress:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Erro interno do servidor',
    }, { status: 500 });
  }
}

// POST /api/onboarding/progress - Salvar/atualizar progresso
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken();

    if (!userId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Usuário não autenticado',
      }, { status: 401 });
    }

    const body = await request.json() as SaveProgressPayload;
    const { onboarding_type, current_section, current_question, total_questions } = body;

    if (!onboarding_type) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Tipo de onboarding não informado',
      }, { status: 400 });
    }

    const supabase = createServerClient();

    // Verificar se já existe progresso
    const { data: existing } = await supabase
      .from('onboarding_progress')
      .select('id, status')
      .eq('user_id', userId)
      .eq('onboarding_type', onboarding_type)
      .single();

    const now = new Date().toISOString();

    if (existing) {
      // Atualizar progresso existente
      const updateData: Partial<OnboardingProgress> = {
        current_section,
        current_question,
        last_saved_at: now,
        status: 'in_progress',
      };

      if (total_questions !== undefined) {
        updateData.total_questions = total_questions;
      }

      const { data, error } = await supabase
        .from('onboarding_progress')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating progress:', error);
        return NextResponse.json<ApiResponse>({
          success: false,
          error: 'Erro ao atualizar progresso',
        }, { status: 500 });
      }

      return NextResponse.json<ApiResponse<OnboardingProgress>>({
        success: true,
        data,
      });

    } else {
      // Criar novo progresso
      const { data, error } = await supabase
        .from('onboarding_progress')
        .insert({
          user_id: userId,
          onboarding_type,
          current_section,
          current_question,
          total_questions: total_questions || 0,
          status: 'in_progress',
          started_at: now,
          last_saved_at: now,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating progress:', error);
        return NextResponse.json<ApiResponse>({
          success: false,
          error: 'Erro ao criar progresso',
        }, { status: 500 });
      }

      return NextResponse.json<ApiResponse<OnboardingProgress>>({
        success: true,
        data,
      }, { status: 201 });
    }

  } catch (error) {
    console.error('Error in POST /api/onboarding/progress:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Erro interno do servidor',
    }, { status: 500 });
  }
}

// PATCH /api/onboarding/progress - Marcar como completo
export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken();

    if (!userId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Usuário não autenticado',
      }, { status: 401 });
    }

    const body = await request.json();
    const { onboarding_type } = body;

    if (!onboarding_type) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Tipo de onboarding não informado',
      }, { status: 400 });
    }

    const supabase = createServerClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('onboarding_progress')
      .update({
        status: 'completed',
        completed_at: now,
        last_saved_at: now,
      })
      .eq('user_id', userId)
      .eq('onboarding_type', onboarding_type)
      .select()
      .single();

    if (error) {
      console.error('Error completing onboarding:', error);
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Erro ao finalizar onboarding',
      }, { status: 500 });
    }

    return NextResponse.json<ApiResponse<OnboardingProgress>>({
      success: true,
      data,
    });

  } catch (error) {
    console.error('Error in PATCH /api/onboarding/progress:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Erro interno do servidor',
    }, { status: 500 });
  }
}
