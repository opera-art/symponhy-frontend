import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, getUserIdFromToken } from '@/lib/supabase/server';
import {
  ApiResponse,
  ESSENTIAL_SECTION_MAP,
  COMPLETE_SECTION_MAP
} from '@/types/onboarding';

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

// GET /api/onboarding/all - Obter todos os dados do onboarding
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

    if (!type) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Tipo de onboarding é obrigatório',
      }, { status: 400 });
    }

    // Criar clientes para os schemas corretos
    const supabase = createServerClient(type);
    const supabasePublic = createServerClient('public');
    const sectionMap = type === 'essential' ? ESSENTIAL_SECTION_MAP : COMPLETE_SECTION_MAP;

    // Buscar dados de todas as seções em paralelo
    const promises = Object.entries(sectionMap).map(async ([index, tableName]) => {
      // Para tabelas 1:N como produtos, buscar todos os registros
      if (tableName === 'produtos' || tableName === 'concorrentes') {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('user_id', userId);

        if (error && error.code !== 'PGRST116') {
          console.error(`Error fetching ${tableName}:`, error);
          return { index: parseInt(index), tableName, data: [] };
        }

        return {
          index: parseInt(index),
          tableName,
          data: (data || []).map(item => mapFieldsFromDB(item)),
        };
      }

      // Para tabelas 1:1, buscar registro único
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error(`Error fetching ${tableName}:`, error);
        return { index: parseInt(index), tableName, data: null };
      }

      return {
        index: parseInt(index),
        tableName,
        data: data ? mapFieldsFromDB(data) : null,
      };
    });

    const results = await Promise.all(promises);

    // Organizar dados por seção
    const sections: Record<string, unknown> = {};
    const formData: Record<string, unknown> = {};

    for (const result of results) {
      sections[result.tableName] = result.data;

      // Mesclar dados no formData para facilitar uso no frontend
      if (result.data && !Array.isArray(result.data)) {
        Object.assign(formData, result.data);
      }
    }

    // Buscar progresso também (no schema public)
    const { data: progress } = await supabasePublic
      .from('onboarding_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('onboarding_type', type)
      .single();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        sections,
        formData,
        progress: progress || null,
      },
    });

  } catch (error) {
    console.error('Error in GET /api/onboarding/all:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Erro interno do servidor',
    }, { status: 500 });
  }
}
