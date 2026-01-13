import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, getUserIdFromToken } from '@/lib/supabase/server';
import {
  SaveSectionPayload,
  ApiResponse,
  ESSENTIAL_SECTION_MAP,
  COMPLETE_SECTION_MAP
} from '@/types/onboarding';

// Mapear campo do frontend para campo do banco (camelCase -> snake_case)
function mapFieldsToDB(data: Record<string, unknown>): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    // Converter camelCase para snake_case
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    mapped[snakeKey] = value;
  }

  return mapped;
}

// Mapear campo do banco para frontend (snake_case -> camelCase)
function mapFieldsFromDB(data: Record<string, unknown>): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    // Ignorar campos internos
    if (['id', 'user_id', 'created_at', 'updated_at'].includes(key)) continue;

    // Converter snake_case para camelCase
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    mapped[camelKey] = value;
  }

  return mapped;
}

// GET /api/onboarding/section - Obter dados de uma seção
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
    const type = searchParams.get('type') as 'essential' | 'complete';
    const sectionIndex = searchParams.get('section');

    if (!type || sectionIndex === null) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Tipo e seção são obrigatórios',
      }, { status: 400 });
    }

    const sectionMap = type === 'essential' ? ESSENTIAL_SECTION_MAP : COMPLETE_SECTION_MAP;
    const tableName = sectionMap[parseInt(sectionIndex)];

    if (!tableName) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Seção inválida',
      }, { status: 400 });
    }

    // Criar cliente com o schema correto
    const supabase = createServerClient(type);

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching section:', error);
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Erro ao buscar dados da seção',
      }, { status: 500 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: data ? mapFieldsFromDB(data) : null,
    });

  } catch (error) {
    console.error('Error in GET /api/onboarding/section:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Erro interno do servidor',
    }, { status: 500 });
  }
}

// POST /api/onboarding/section - Salvar dados de uma seção
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken();

    if (!userId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Usuário não autenticado',
      }, { status: 401 });
    }

    const body = await request.json() as SaveSectionPayload;
    const { onboarding_type, section_index, data: sectionData, current_question } = body;

    if (!onboarding_type || section_index === undefined || !sectionData) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Dados incompletos',
      }, { status: 400 });
    }

    const sectionMap = onboarding_type === 'essential' ? ESSENTIAL_SECTION_MAP : COMPLETE_SECTION_MAP;
    const tableName = sectionMap[section_index];

    if (!tableName) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Seção inválida',
      }, { status: 400 });
    }

    // Criar cliente com o schema correto
    const supabase = createServerClient(onboarding_type);
    const supabasePublic = createServerClient('public');

    // Mapear campos para o formato do banco
    const dbData = mapFieldsToDB(sectionData as Record<string, unknown>);

    // Verificar se já existe registro
    const { data: existing } = await supabase
      .from(tableName)
      .select('id')
      .eq('user_id', userId)
      .single();

    let result;

    if (existing) {
      // Atualizar
      const { data, error } = await supabase
        .from(tableName)
        .update({
          ...dbData,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating section:', error);
        return NextResponse.json<ApiResponse>({
          success: false,
          error: 'Erro ao atualizar seção',
        }, { status: 500 });
      }

      result = data;
    } else {
      // Inserir
      const { data, error } = await supabase
        .from(tableName)
        .insert({
          user_id: userId,
          ...dbData,
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting section:', error);
        return NextResponse.json<ApiResponse>({
          success: false,
          error: 'Erro ao salvar seção',
        }, { status: 500 });
      }

      result = data;
    }

    // Atualizar progresso também (no schema public)
    if (current_question !== undefined) {
      const now = new Date().toISOString();

      const { data: progressExists } = await supabasePublic
        .from('onboarding_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('onboarding_type', onboarding_type)
        .single();

      if (progressExists) {
        await supabasePublic
          .from('onboarding_progress')
          .update({
            current_section: section_index,
            current_question,
            last_saved_at: now,
            status: 'in_progress',
          })
          .eq('id', progressExists.id);
      } else {
        await supabasePublic
          .from('onboarding_progress')
          .insert({
            user_id: userId,
            onboarding_type,
            current_section: section_index,
            current_question,
            status: 'in_progress',
            started_at: now,
            last_saved_at: now,
          });
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result ? mapFieldsFromDB(result) : null,
    });

  } catch (error) {
    console.error('Error in POST /api/onboarding/section:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Erro interno do servidor',
    }, { status: 500 });
  }
}
