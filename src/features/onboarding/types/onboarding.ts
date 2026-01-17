// Tipos para o onboarding Essential

export interface EssentialDadosBasicos {
  razao_social?: string;
  nome_fantasia?: string;
  cnpj?: string;
  data_fundacao?: string;
  site_institucional?: string;
  estados_cidades?: string;
  paises_internacionais?: string;
  tem_sede_fixa?: string;
  endereco_sede?: string;
  segmento_especifico?: string;
  faturamento_anual?: string;
}

export interface EssentialRedesSociais {
  instagram?: string;
  tiktok?: string;
  youtube_shorts?: string;
  threads?: string;
  reclame_aqui?: string;
  google_meu_negocio?: string;
  outros_canais?: string;
}

export interface EssentialIdentidade {
  o_que_faz?: string;
  para_quem?: string;
  como_comecou?: string;
  missao?: string;
  visao_3a5_anos?: string;
  valores?: string;
}

export interface EssentialOferta {
  produto_prioritario?: string;
  preco_produto?: string;
  formas_pagamento?: string[];
  o_que_incluso?: string;
  o_que_nao_incluso?: string;
  transformacao_entrega?: string;
  tem_provas_sociais?: string;
  links_provas_sociais?: string;
  link_pagina_produto?: string;
}

export interface EssentialIcp {
  tipo_cliente?: string;
  cliente_ideal?: string;
  tres_dores?: string;
  tres_desejos?: string;
  tres_objecoes?: string;
  frases_cliente?: string;
  onde_cliente_vive?: string[];
  pesquisas_google?: string;
}

export interface EssentialFunil {
  como_cliente_chega?: string[];
  proximo_passo?: string[];
  capacidade_entrega?: string;
  maiores_gargalos?: string[];
  faq_perguntas?: string;
  por_que_nao_fecham?: string;
  sabe_numeros?: string;
  ticket_medio?: string;
  cac?: string;
  taxa_conversao?: string;
}

export interface EssentialMarca {
  tom_marca?: string[];
  palavras_usa_muito?: string;
  palavras_evita?: string;
  temas_proibidos?: string;
  verdade_incomoda?: string;
  como_responde_criticas?: string;
}

export interface EssentialConteudo {
  objetivo_redes?: string[];
  primeira_impressao?: string;
  plataformas_prioritarias?: string[];
  frequencia_desejada?: string;
  formatos_consegue_produzir?: string[];
  rosto_conteudo?: string[];
  quem_grava?: string;
  tem_editor?: string;
  quadro_serie?: string;
  qual_quadro?: string;
  ctas_permitidos?: string[];
  tem_lead_magnet?: string;
  link_lead_magnet?: string;
  temas_publico_ama?: string;
  agenda_90_dias?: string;
}

export interface EssentialConcorrencia {
  concorrentes_diretos?: string;
  onde_concorrentes_melhores?: string;
  por_que_escolhem_voce?: string;
  referencias_conteudo?: string;
  o_que_quer_copiar?: string;
  referencia_nao_gosta?: string;
}

export interface EssentialFinal {
  algo_mais?: string;
  restricao_legal?: string;
}

// Mapeamento de seções para tabelas do Essential
export const ESSENTIAL_SECTION_MAP: Record<number, string> = {
  0: 'dados_basicos',
  1: 'redes_sociais',
  2: 'identidade',
  3: 'oferta',
  4: 'icp',
  5: 'funil',
  6: 'marca',
  7: 'conteudo',
  8: 'concorrencia',
  9: 'final',
};

// Tipos para o onboarding Complete

export interface CompleteDadosCadastrais {
  razao_social?: string;
  nome_fantasia?: string;
  cnpj?: string;
  inscricao_estadual?: string;
  data_fundacao?: string;
  tipo_empresa?: string;
  endereco_completo?: string;
  telefone_comercial?: string;
  email_principal?: string;
  site_institucional?: string;
  responsavel_contato?: string;
  telefone_responsavel?: string;
  email_responsavel?: string;
}

export interface CompleteRedesSociais {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
  pinterest?: string;
  threads?: string;
  outras_redes?: string;
  reclame_aqui?: string;
  google_meu_negocio?: string;
}

export interface CompleteEstrategia {
  missao?: string;
  visao?: string;
  valores?: string;
  objetivo_principal?: string;
  objetivo_secundario?: string;
  metas_quantitativas?: string;
  publico_alvo_primario?: string;
  publico_alvo_secundario?: string;
  proposta_valor?: string;
  diferenciais_competitivos?: string;
  posicionamento_mercado?: string;
}

export interface CompleteSwot {
  forcas?: string;
  fraquezas?: string;
  oportunidades?: string;
  ameacas?: string;
  acoes_forcas?: string;
  acoes_fraquezas?: string;
  acoes_oportunidades?: string;
  acoes_ameacas?: string;
}

export interface CompleteFunil {
  topo_funil?: string;
  meio_funil?: string;
  fundo_funil?: string;
  canais_aquisicao?: string[];
  taxa_conversao_topo?: string;
  taxa_conversao_meio?: string;
  taxa_conversao_fundo?: string;
  ciclo_vendas?: string;
  ticket_medio?: string;
  ltv?: string;
  cac?: string;
  estrategia_retencao?: string;
}

export interface CompleteConcorrente {
  nome?: string;
  site?: string;
  redes_sociais?: string;
  pontos_fortes?: string;
  pontos_fracos?: string;
  estrategia_preco?: string;
  posicionamento?: string;
  diferenciais?: string;
  ameaca_nivel?: string;
}

export interface CompleteProduto {
  nome?: string;
  descricao?: string;
  categoria?: string;
  preco?: string;
  margem?: string;
  publico_alvo?: string;
  beneficios?: string;
  diferenciais?: string;
  concorrentes_diretos?: string;
  ciclo_vida?: string;
  estrategia_preco?: string;
}

export interface CompleteMarca {
  nome_marca?: string;
  slogan?: string;
  historia_marca?: string;
  personalidade_marca?: string;
  tom_voz?: string;
  cores_principais?: string;
  cores_secundarias?: string;
  tipografia_principal?: string;
  tipografia_secundaria?: string;
  elementos_visuais?: string;
  do_nots?: string;
  arquetipos?: string[];
  atributos_marca?: string;
  promessa_marca?: string;
  essencia_marca?: string;
}

export interface CompleteIcp {
  nome_persona?: string;
  idade?: string;
  genero?: string;
  localizacao?: string;
  escolaridade?: string;
  profissao?: string;
  renda?: string;
  estado_civil?: string;
  filhos?: string;
  hobbies?: string;
  valores_pessoais?: string;
  objetivos?: string;
  desafios?: string;
  medos?: string;
  objecoes?: string;
  canais_preferidos?: string[];
  influenciadores?: string;
  marcas_preferidas?: string;
  jornada_compra?: string;
  gatilhos_compra?: string;
  criterios_decisao?: string;
}

export interface CompleteConteudo {
  objetivo_conteudo?: string;
  pilares_conteudo?: string[];
  formatos_preferidos?: string[];
  frequencia_publicacao?: string;
  plataformas_foco?: string[];
  tom_comunicacao?: string;
  temas_evitar?: string;
  hashtags_principais?: string;
  ctas_padrao?: string;
  metricas_sucesso?: string;
  calendario_editorial?: string;
  processo_aprovacao?: string;
  equipe_conteudo?: string;
  ferramentas_usadas?: string;
  orcamento_conteudo?: string;
}

export interface CompleteReferencias {
  referencias_visuais?: string;
  referencias_comunicacao?: string;
  referencias_nao_gosta?: string;
  inspiracoes_outras_industrias?: string;
  benchmarks_internacionais?: string;
  materiais_existentes?: string;
  observacoes_finais?: string;
}

// Mapeamento de seções para tabelas do Complete
export const COMPLETE_SECTION_MAP: Record<number, string> = {
  0: 'dados_cadastrais',
  1: 'redes_sociais',
  2: 'estrategia',
  3: 'swot',
  4: 'funil',
  5: 'concorrentes',
  6: 'produtos',
  7: 'marca',
  8: 'icp',
  9: 'conteudo',
  10: 'referencias',
};

// Tipo para o progresso do onboarding
export interface OnboardingProgress {
  id?: string;
  user_id: string;
  onboarding_type: 'essential' | 'complete';
  current_section: number;
  current_question: number;
  total_questions: number;
  status: 'not_started' | 'in_progress' | 'completed';
  started_at?: string;
  last_saved_at?: string;
  completed_at?: string;
  created_at?: string;
}

// Payload para salvar seção
export interface SaveSectionPayload {
  onboarding_type: 'essential' | 'complete';
  section_index: number;
  data: Record<string, unknown>;
  current_question?: number;
}

// Payload para salvar progresso
export interface SaveProgressPayload {
  onboarding_type: 'essential' | 'complete';
  current_section: number;
  current_question: number;
  total_questions?: number;
}

// Response tipo genérico
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
