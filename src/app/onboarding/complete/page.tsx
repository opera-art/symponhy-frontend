'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FloatingOracle } from '@/components/chat/FloatingOracle';
import { ArrowLeft, ArrowRight, Check, Sparkles, Crown, Plus, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: string;
  formasPagamento: string;
  categoria: string;
  entrega: string;
  incluso: string;
  naoIncluso: string;
  porqueComprar: string;
  garantia: string;
  lpLink: string;
  provasSociais: string;
  outrasInfos: string;
}

interface FormData {
  // 1) Dados cadastrais
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  dataFundacao: string;
  siteInstitucional: string;
  estadosCidades: string;
  paisesInternacional: string;
  temSedeFisica: string;
  enderecoSede: string;
  segmentoEspecifico: string;
  faturamentoAnual: string;
  // 1.5 Redes sociais
  instagram: string;
  tiktok: string;
  youtubeShorts: string;
  threads: string;
  reclameAqui: string;
  googleMeuNegocio: string;
  outrosCanais: string;

  // 2) Estratégia do negócio
  oQueEEmpresa: string;
  historiaEmpresa: string;
  sociosFundadores: string;
  missao: string;
  visao: string;
  valores: string;
  contraValores: string;
  legado: string;
  grandeSonho: string;
  temPlanoNegocio: string;
  uploadPlanoNegocio: string;
  sabeMarketShare: string;
  marketShareNumero: string;
  planejamentoMarketing: string;
  uploadPlanejamento: string;
  metasIndicadores: string;

  // 3) SWOT
  forcasVantagens: string;
  fraquezas: string;
  ameacas: string;
  oportunidades: string;
  // 3.2 Sazonalidade
  calendarioAnual: string;
  temSazonalidade: string;
  explicacaoSazonalidade: string;
  mesesVendasCaem: string;
  // 3.3 Mercado externo
  tendenciasMercado: string;
  previsoesEspecialistas: string;
  fatoresPoliticos: string;
  fatoresEconomicos: string;
  fatoresSociais: string;
  fatoresTecnologicos: string;
  fatoresAmbientais: string;
  fatoresLegais: string;
  noticiasRecentes: string;

  // 4) Funil de vendas
  modeloVendas: string;
  origemClientes: string[];
  produtoPrioritario: string;
  canaisMaisTrazem: string;
  capacidadeEntrega: string;
  gargalos: string[];
  faqTop10: string;
  pontosCaptura: string[];
  taxaVisitaLead: string;
  taxaLeadCall: string;
  taxaCallVenda: string;
  cac: string;
  ticketMedio: string;
  ltv: string;
  churn: string;
  processoFollowUp: string;
  argumentosVenda: string;
  motivosNaoFechamento: string;

  // 5) Concorrentes
  concorrentesDiretos: string;
  ondeSaoMelhores: string;
  fatoresEscolhaConcorrencia: string;
  diferenciaisMelhor: string;
  concorrentesIndiretos: string;

  // 6) Produtos (array)
  products: Product[];

  // 7) Marca e comunicação
  slogan: string;
  uploadBrandbook: string;
  uploadLogo: string;
  arquetipoMarca: string;
  personalidadeMarca: string;
  palavrasChaveMarca: string;
  palavrasNaoDescrevem: string;
  // 7.1 Tom de voz
  tomDeVoz: string[];
  palavrasEvitar: string;
  guiaEmojis: string;
  frasesEngracadas: string;
  // 7.2 Posicionamento
  temPosicionamentoPolitico: string;
  explicacaoPosicionamento: string;
  opinioesFortes: string;
  // 7.4 Metodologia
  temMetodologiaPropria: string;
  etapasMetodologia: string;
  // 7.5 Crise
  politicaCrise: string;

  // 8) ICP
  jaFezEstudoICP: string;
  baseDados: string;
  instagramMelhoresClientes: string;
  tipoClientePrincipal: string;
  descricaoPublicoAlvo: string;
  top5Dores: string;
  top5Desejos: string;
  ondeICPVive: string;
  quemInfluenciaDecisao: string;
  nivelConsciencia: string;
  oqueBuscaGoogle: string;
  porqueCompram: string;
  lugaresFrequentam: string;
  marcasConsumem: string;
  medosProfundos: string;
  momentoVidaAtual: string;
  experienciaIdeal: string;
  problemaResolver: string;
  perfilEvitar: string;
  // 8.3 Dores profundas
  dorSilenciosa: string;
  pensamentosSozinha: string;
  tentaNaoFunciona: string;
  medoContinuar: string;
  palavraComoSeSente: string;
  // 8.4 Sonhos
  conquistar6Meses: string;
  comoQuerSeSentir: string;
  oqueAcreditaPrecisa: string;
  comprariaSemPensar: string;
  // 8.5 Comportamento
  oqueObservaConfiar: string;
  jaComprouParecido: string;
  comoFalaDiaDia: string;
  mensagemEmociona: string;
  linguagemConecta: string;
  // 8.6 Transformação
  personaAntes: string;
  resultadosPraticos: string;
  feedbackInesquecivel: string;
  bastidoresConteudo: string;

  // 9) Preferências conteúdo
  maiorObjetivoRedes: string;
  primeiraImpressao: string;
  marcasCollab: string;
  abertoInfluenciadores: string;
  influenciadoresLista: string;
  verdadesPolemicas: string;
  quemVaiGravar: string;
  oqueGostaProduzir: string;
  formatoEvita: string;
  metricasImportam: string;
  plataformasUsaExplorar: string;
  jaInvestiuTrafego: string;
  restricaoLegal: string;
  // 9.1 Produção
  orcamentoMensal: string;
  frequenciaDesejada: string;
  quadroFixo: string;
  uploadCronogramas: string;
  // 9.2 Configurações
  plataformasPrioritarias: string[];
  formatosConsegueProduzir: string[];
  recursosDisponiveis: string;
  rostoConteudo: string;
  pautasPodeFalar: string;
  pautasNaoQuerFalar: string;
  lancamentos90Dias: string;
  ctasPermitidos: string[];
  iscasExistentes: string;
  top10Mitos: string;
  top10Cases: string;
  recadoFinal: string;

  // 10) Referências
  referenciasGringas: string;
  referenciasNaoGosta: string;
  referenciasGosta: string;
  conteudoIdealMistura: string;
}

const createEmptyProduct = (): Product => ({
  id: Date.now().toString(),
  nome: '',
  descricao: '',
  preco: '',
  formasPagamento: '',
  categoria: '',
  entrega: '',
  incluso: '',
  naoIncluso: '',
  porqueComprar: '',
  garantia: '',
  lpLink: '',
  provasSociais: '',
  outrasInfos: '',
});

const questions = [
  // SEÇÃO 1: DADOS CADASTRAIS
  { id: 'razaoSocial', question: 'Qual a razão social da empresa?', placeholder: 'Ex: Empresa XYZ LTDA', type: 'text', section: '1. Dados Cadastrais' },
  { id: 'nomeFantasia', question: 'Qual o nome fantasia / nome comercial?', placeholder: 'Ex: XYZ Marketing', type: 'text', section: '1. Dados Cadastrais' },
  { id: 'cnpj', question: 'Qual o CNPJ? (opcional)', placeholder: 'XX.XXX.XXX/XXXX-XX', type: 'text', section: '1. Dados Cadastrais' },
  { id: 'dataFundacao', question: 'Qual a data de fundação da empresa?', placeholder: 'dd/mm/aaaa', type: 'text', section: '1. Dados Cadastrais' },
  { id: 'siteInstitucional', question: 'Qual o site institucional?', placeholder: 'https://www.seusite.com.br', type: 'text', section: '1. Dados Cadastrais' },
  { id: 'estadosCidades', question: 'Quais estados/cidades você atende?', placeholder: 'Ex: São Paulo, Rio de Janeiro, Brasil inteiro...', type: 'textarea', section: '1. Dados Cadastrais' },
  { id: 'paisesInternacional', question: 'Se atende internacionalmente, quais países?', placeholder: 'Ex: EUA, Portugal, México... ou deixe em branco', type: 'text', section: '1. Dados Cadastrais' },
  { id: 'temSedeFisica', question: 'A empresa tem sede física fixa?', type: 'select', options: [{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }], section: '1. Dados Cadastrais' },
  { id: 'enderecoSede', question: 'Se sim, qual o endereço da sede?', placeholder: 'Rua, número, bairro, cidade, estado', type: 'textarea', section: '1. Dados Cadastrais' },
  { id: 'segmentoEspecifico', question: 'Qual é o segmento específico da empresa hoje?', placeholder: 'Ex: clínica de estética, consultoria financeira, agência de tráfego...', type: 'text', section: '1. Dados Cadastrais' },
  { id: 'faturamentoAnual', question: 'Qual o faturamento anual atual (estimativa)?', placeholder: 'Ex: R$ 500.000 ou faixa de R$ 200k-500k', type: 'text', section: '1. Dados Cadastrais' },
  // Redes sociais
  { id: 'instagram', question: 'Qual o Instagram da marca?', placeholder: 'https://instagram.com/suamarca', type: 'text', section: '1.5 Redes Sociais' },
  { id: 'tiktok', question: 'Qual o TikTok?', placeholder: 'https://tiktok.com/@suamarca', type: 'text', section: '1.5 Redes Sociais' },
  { id: 'youtubeShorts', question: 'Qual o YouTube Shorts?', placeholder: 'Link do canal', type: 'text', section: '1.5 Redes Sociais' },
  { id: 'threads', question: 'Qual o Threads?', placeholder: 'Link do perfil', type: 'text', section: '1.5 Redes Sociais' },
  { id: 'reclameAqui', question: 'Tem perfil no Reclame Aqui?', placeholder: 'Link do perfil', type: 'text', section: '1.5 Redes Sociais' },
  { id: 'googleMeuNegocio', question: 'Tem Google Meu Negócio?', placeholder: 'Link do perfil', type: 'text', section: '1.5 Redes Sociais' },
  { id: 'outrosCanais', question: 'Outros canais (YouTube longo, LinkedIn, Blog, Pinterest, Podcast)?', placeholder: 'Liste todos os links', type: 'textarea', section: '1.5 Redes Sociais' },

  // SEÇÃO 2: ESTRATÉGIA DO NEGÓCIO
  { id: 'oQueEEmpresa', question: 'O que é a empresa? (resuma em 1 parágrafo)', placeholder: 'Descreva sua empresa de forma concisa...', type: 'textarea', section: '2. Estratégia' },
  { id: 'historiaEmpresa', question: 'Qual é a história da empresa? Como ela foi fundada?', placeholder: 'Conte a origem e jornada da empresa...', type: 'textarea', section: '2. Estratégia' },
  { id: 'sociosFundadores', question: 'Quem são os sócios (ou fundadores) e quais são suas histórias?', placeholder: 'Descreva os fundadores e suas trajetórias...', type: 'textarea', section: '2. Estratégia' },
  { id: 'missao', question: 'Qual a missão da empresa?', placeholder: 'O propósito fundamental da empresa...', type: 'textarea', section: '2. Estratégia' },
  { id: 'visao', question: 'Qual a visão da empresa? Onde você quer estar em 3-5 anos?', placeholder: 'Descreva o futuro desejado...', type: 'textarea', section: '2. Estratégia' },
  { id: 'valores', question: 'Quais são os valores da empresa?', placeholder: 'Liste os valores fundamentais...', type: 'textarea', section: '2. Estratégia' },
  { id: 'contraValores', question: 'Contra valores: o que a empresa não tolera de jeito nenhum?', placeholder: 'O que é inaceitável na cultura da empresa...', type: 'textarea', section: '2. Estratégia' },
  { id: 'legado', question: 'Qual legado você quer deixar no mercado?', placeholder: 'O impacto duradouro que deseja causar...', type: 'textarea', section: '2. Estratégia' },
  { id: 'grandeSonho', question: 'Se pudesse realizar um grande sonho com esse negócio, qual seria?', placeholder: 'Seu maior sonho empresarial...', type: 'textarea', section: '2. Estratégia' },
  { id: 'temPlanoNegocio', question: 'Você tem algum documento/plano de negócios?', type: 'select', options: [{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }], section: '2. Estratégia' },
  { id: 'uploadPlanoNegocio', question: 'Se sim, cole o link do documento:', placeholder: 'Link do Drive, Notion ou outro...', type: 'text', section: '2. Estratégia' },
  { id: 'sabeMarketShare', question: 'Você sabe seu market share (participação no mercado)?', type: 'select', options: [{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }], section: '2. Estratégia' },
  { id: 'marketShareNumero', question: 'Se sim, informe o número e explique como chegou nele:', placeholder: 'Ex: 15% do mercado de SP, calculado por...', type: 'textarea', section: '2. Estratégia' },
  { id: 'planejamentoMarketing', question: 'Existe um planejamento macro de Marketing para este ano?', type: 'select', options: [{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }], section: '2. Estratégia' },
  { id: 'uploadPlanejamento', question: 'Se sim, descreva ou cole o link:', placeholder: 'Descreva o planejamento ou link do documento...', type: 'textarea', section: '2. Estratégia' },
  { id: 'metasIndicadores', question: 'Quais são as metas e KPIs do ano?', placeholder: 'Ex: faturamento, leads, conversão, seguidores...', type: 'textarea', section: '2. Estratégia' },

  // SEÇÃO 3: SWOT
  { id: 'forcasVantagens', question: 'Liste 5 principais forças/vantagens competitivas:', placeholder: '1.\n2.\n3.\n4.\n5.', type: 'textarea', section: '3.1 SWOT' },
  { id: 'fraquezas', question: 'Liste 5 principais fraquezas:', placeholder: '1.\n2.\n3.\n4.\n5.', type: 'textarea', section: '3.1 SWOT' },
  { id: 'ameacas', question: 'Quais são as ameaças externas que podem prejudicar o negócio?', placeholder: 'Liste as principais ameaças...', type: 'textarea', section: '3.1 SWOT' },
  { id: 'oportunidades', question: 'Quais são as oportunidades que podem alavancar o negócio?', placeholder: 'Liste as principais oportunidades...', type: 'textarea', section: '3.1 SWOT' },
  // Sazonalidade
  { id: 'calendarioAnual', question: 'Calendário anual: liste as principais datas/campanhas do ano', placeholder: 'Ex: Black Friday - 29/11 - Promoção especial\nAniversário da empresa - 15/03 - Live especial...', type: 'textarea', section: '3.2 Sazonalidade' },
  { id: 'temSazonalidade', question: 'Seu negócio tem sazonalidade de vendas?', type: 'select', options: [{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }], section: '3.2 Sazonalidade' },
  { id: 'explicacaoSazonalidade', question: 'Se sim, explique a sazonalidade:', placeholder: 'Quando vende mais, quando vende menos...', type: 'textarea', section: '3.2 Sazonalidade' },
  { id: 'mesesVendasCaem', question: 'Em quais meses as vendas caem? Por quê?', placeholder: 'Ex: Janeiro e Fevereiro porque...', type: 'textarea', section: '3.2 Sazonalidade' },
  // Mercado externo
  { id: 'tendenciasMercado', question: 'Quais tendências você enxerga no seu mercado?', placeholder: 'Tendências atuais e futuras...', type: 'textarea', section: '3.3 Mercado Externo' },
  { id: 'previsoesEspecialistas', question: 'O que especialistas dizem que vai acontecer nos próximos anos?', placeholder: 'Previsões do setor...', type: 'textarea', section: '3.3 Mercado Externo' },
  { id: 'fatoresPoliticos', question: 'Fatores POLÍTICOS que afetam seu negócio:', placeholder: 'Regulamentações, políticas públicas...', type: 'textarea', section: '3.3 Mercado Externo' },
  { id: 'fatoresEconomicos', question: 'Fatores ECONÔMICOS que afetam seu negócio:', placeholder: 'Inflação, câmbio, crédito...', type: 'textarea', section: '3.3 Mercado Externo' },
  { id: 'fatoresSociais', question: 'Fatores SOCIAIS que afetam seu negócio:', placeholder: 'Comportamento do consumidor, demografia...', type: 'textarea', section: '3.3 Mercado Externo' },
  { id: 'fatoresTecnologicos', question: 'Fatores TECNOLÓGICOS que afetam seu negócio:', placeholder: 'Novas tecnologias, IA, automação...', type: 'textarea', section: '3.3 Mercado Externo' },
  { id: 'fatoresAmbientais', question: 'Fatores AMBIENTAIS que afetam seu negócio:', placeholder: 'Sustentabilidade, ESG...', type: 'textarea', section: '3.3 Mercado Externo' },
  { id: 'fatoresLegais', question: 'Fatores LEGAIS que afetam seu negócio:', placeholder: 'Leis, regulamentações específicas...', type: 'textarea', section: '3.3 Mercado Externo' },
  { id: 'noticiasRecentes', question: 'Quais notícias recentes têm relação com seu negócio?', placeholder: 'Cole links e explique brevemente...', type: 'textarea', section: '3.3 Mercado Externo' },

  // SEÇÃO 4: FUNIL DE VENDAS
  { id: 'modeloVendas', question: 'Como funciona seu modelo de vendas hoje? (Como o cliente chega até você e qual é o caminho até comprar?)', placeholder: 'Descreva o processo completo...', type: 'textarea', section: '4. Funil de Vendas' },
  { id: 'origemClientes', question: 'Além das redes sociais, de onde vêm seus clientes?', type: 'multiselect', options: [
    { value: 'indicacoes', label: 'Indicações' },
    { value: 'eventos', label: 'Eventos' },
    { value: 'parcerias', label: 'Parcerias' },
    { value: 'trafegoPago', label: 'Tráfego Pago' },
    { value: 'googleSeo', label: 'Google/SEO' },
    { value: 'prospeccao', label: 'Prospecção/Outreach' },
    { value: 'outros', label: 'Outros' },
  ], section: '4. Funil de Vendas' },
  { id: 'produtoPrioritario', question: 'Qual produto/serviço vocês mais querem vender (prioritário)?', placeholder: 'O produto foco principal...', type: 'text', section: '4. Funil de Vendas' },
  { id: 'canaisMaisTrazem', question: 'Canais que mais trazem clientes hoje (com % aproximada):', placeholder: 'Ex: Instagram 40%, Indicações 30%, Google 20%...', type: 'textarea', section: '4. Funil de Vendas' },
  { id: 'capacidadeEntrega', question: 'Capacidade de entrega atual: quantos clientes por mês sem "quebrar"?', placeholder: 'Ex: 50 clientes/mês', type: 'text', section: '4. Funil de Vendas' },
  { id: 'gargalos', question: 'Quais são os 3 maiores gargalos hoje?', type: 'multiselect', options: [
    { value: 'faltaLeads', label: 'Falta de leads' },
    { value: 'leadsRuins', label: 'Leads ruins' },
    { value: 'baixaConversao', label: 'Baixa conversão' },
    { value: 'ticketBaixo', label: 'Ticket baixo' },
    { value: 'faltaProvaSocial', label: 'Falta de prova social' },
    { value: 'processoComercialFraco', label: 'Processo comercial fraco' },
    { value: 'retencaoChurn', label: 'Retenção/churn' },
    { value: 'faltaClarezaOferta', label: 'Falta de clareza de oferta' },
    { value: 'faltaTempoConteudo', label: 'Falta de tempo/equipe para conteúdo' },
    { value: 'operacaoDesorganizada', label: 'Operação desorganizada' },
  ], section: '4. Funil de Vendas' },
  { id: 'faqTop10', question: 'Top 10 perguntas que o cliente faz antes de comprar (FAQ real):', placeholder: '1. Quanto custa?\n2. Quanto tempo demora?\n3. Tem garantia?...', type: 'textarea', section: '4. Funil de Vendas' },
  { id: 'pontosCaptura', question: 'Pontos de captura de leads hoje:', type: 'multiselect', options: [
    { value: 'dm', label: 'DM' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'formulario', label: 'Formulário' },
    { value: 'landingPage', label: 'Landing page' },
    { value: 'call', label: 'Call' },
    { value: 'checkout', label: 'Checkout' },
    { value: 'outros', label: 'Outros' },
  ], section: '4. Funil de Vendas' },
  { id: 'taxaVisitaLead', question: 'Taxa: Visita → Lead (se souber):', placeholder: 'Ex: 5%', type: 'text', section: '4. Funil de Vendas' },
  { id: 'taxaLeadCall', question: 'Taxa: Lead → Call (se souber):', placeholder: 'Ex: 30%', type: 'text', section: '4. Funil de Vendas' },
  { id: 'taxaCallVenda', question: 'Taxa: Call → Venda (se souber):', placeholder: 'Ex: 25%', type: 'text', section: '4. Funil de Vendas' },
  { id: 'cac', question: 'CAC - Custo de Aquisição de Cliente (se souber):', placeholder: 'Ex: R$ 150', type: 'text', section: '4. Funil de Vendas' },
  { id: 'ticketMedio', question: 'Ticket médio:', placeholder: 'Ex: R$ 2.000', type: 'text', section: '4. Funil de Vendas' },
  { id: 'ltv', question: 'LTV - Lifetime Value (se souber):', placeholder: 'Ex: R$ 8.000', type: 'text', section: '4. Funil de Vendas' },
  { id: 'churn', question: 'Churn (se tiver recorrência):', placeholder: 'Ex: 5% ao mês', type: 'text', section: '4. Funil de Vendas' },
  { id: 'processoFollowUp', question: 'Processo de follow-up: como vocês acompanham o lead até fechar?', placeholder: 'Descreva o processo de acompanhamento...', type: 'textarea', section: '4. Funil de Vendas' },
  { id: 'argumentosVenda', question: 'Principais argumentos de venda (script real):', placeholder: 'Os argumentos que mais convertem...', type: 'textarea', section: '4. Funil de Vendas' },
  { id: 'motivosNaoFechamento', question: 'Principais motivos de não fechamento:', placeholder: 'Por que os leads não fecham...', type: 'textarea', section: '4. Funil de Vendas' },

  // SEÇÃO 5: CONCORRENTES
  { id: 'concorrentesDiretos', question: 'Quem são seus concorrentes diretos? (mín. 3, ideal 10)\nPara cada um: Instagram + site + no que vocês se diferenciam', placeholder: '1. Concorrente A - @instagram - site.com - diferencial\n2. Concorrente B...', type: 'textarea', section: '5. Concorrentes' },
  { id: 'ondeSaoMelhores', question: 'Seja sincero: onde eles são melhores que vocês?', placeholder: 'Pontos fortes dos concorrentes...', type: 'textarea', section: '5. Concorrentes' },
  { id: 'fatoresEscolhaConcorrencia', question: 'Quais fatores fazem um cliente escolher a concorrência?', placeholder: 'Por que perdem clientes para concorrentes...', type: 'textarea', section: '5. Concorrentes' },
  { id: 'diferenciaisMelhor', question: 'O que você faz melhor do que qualquer concorrente?', placeholder: 'Seu diferencial único...', type: 'textarea', section: '5. Concorrentes' },
  { id: 'concorrentesIndiretos', question: 'Concorrentes indiretos (o que concorre pela mesma atenção/dinheiro):', placeholder: 'Ex: "viajar" concorre com "comprar iPhone"', type: 'textarea', section: '5. Concorrentes' },

  // SEÇÃO 6: PRODUTOS - Será tratado separadamente
  { id: 'products', question: 'Cadastro de Produtos/Serviços', type: 'products', section: '6. Produtos' },

  // SEÇÃO 7: MARCA E COMUNICAÇÃO
  { id: 'slogan', question: 'Qual o slogan da empresa?', placeholder: 'Ex: "Just Do It"', type: 'text', section: '7. Marca' },
  { id: 'uploadBrandbook', question: 'Link do brandbook/manual de marca (se tiver):', placeholder: 'Link do arquivo...', type: 'text', section: '7. Marca' },
  { id: 'uploadLogo', question: 'Link da logo e variações (se tiver):', placeholder: 'Link do arquivo...', type: 'text', section: '7. Marca' },
  { id: 'arquetipoMarca', question: 'Arquétipo da marca (se souber):', placeholder: 'Ex: Herói, Sábio, Explorador...', type: 'text', section: '7. Marca' },
  { id: 'personalidadeMarca', question: 'Personalidade da marca: descreva como se ela fosse uma pessoa', placeholder: 'Se a marca fosse uma pessoa, como seria?', type: 'textarea', section: '7. Marca' },
  { id: 'palavrasChaveMarca', question: 'Liste palavras-chave associadas à sua marca:', placeholder: 'Palavras que representam a marca...', type: 'textarea', section: '7. Marca' },
  { id: 'palavrasNaoDescrevem', question: '3 palavras que NÃO podem descrever sua marca:', placeholder: 'Ex: Barato, Comum, Antiquado', type: 'text', section: '7. Marca' },
  // 7.1 Tom de voz
  { id: 'tomDeVoz', question: 'Tom de voz desejado (pode marcar mais de um):', type: 'multiselect', options: [
    { value: 'educativo', label: 'Educativo' },
    { value: 'inspirador', label: 'Inspirador' },
    { value: 'provocador', label: 'Provocador' },
    { value: 'tecnico', label: 'Técnico' },
    { value: 'espiritual', label: 'Espiritual' },
    { value: 'humor', label: 'Humor' },
    { value: 'sofisticado', label: 'Sofisticado' },
    { value: 'popular', label: 'Popular' },
    { value: 'polemico', label: 'Polêmico' },
  ], section: '7.1 Tom de Voz' },
  { id: 'palavrasEvitar', question: 'Palavras/temas que você evita:', placeholder: 'Termos proibidos na comunicação...', type: 'textarea', section: '7.1 Tom de Voz' },
  { id: 'guiaEmojis', question: 'Guia de emojis da marca: quais emojis combinam com a marca?', placeholder: 'Ex: ✨💼🚀', type: 'text', section: '7.1 Tom de Voz' },
  { id: 'frasesEngracadas', question: 'Frases curtas e engraçadas do dia a dia da empresa (se tiver):', placeholder: 'Bordões, frases internas...', type: 'textarea', section: '7.1 Tom de Voz' },
  // 7.2 Posicionamento
  { id: 'temPosicionamentoPolitico', question: 'Você tem posicionamento político, religioso ou ideológico?', type: 'select', options: [{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }], section: '7.2 Posicionamento' },
  { id: 'explicacaoPosicionamento', question: 'Se sim, explique qual e como aparece na comunicação:', placeholder: 'Descreva o posicionamento...', type: 'textarea', section: '7.2 Posicionamento' },
  { id: 'opinioesFortes', question: 'Que opiniões fortes ou verdades incômodas você sustenta sobre seu nicho?', placeholder: 'Posições que você defende...', type: 'textarea', section: '7.2 Posicionamento' },
  // 7.4 Metodologia
  { id: 'temMetodologiaPropria', question: 'Você segue uma metodologia própria?', type: 'select', options: [{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }], section: '7.4 Metodologia' },
  { id: 'etapasMetodologia', question: 'Se sim, quais etapas/pilares?', placeholder: 'Descreva a metodologia...', type: 'textarea', section: '7.4 Metodologia' },
  // 7.5 Crise
  { id: 'politicaCrise', question: 'Qual é a política interna para situações adversas? (Desrespeito, clientes irritados, haters)', placeholder: 'Como lidam com crises...', type: 'textarea', section: '7.5 Crise' },

  // SEÇÃO 8: ICP
  { id: 'jaFezEstudoICP', question: 'Você já fez esse estudo de ICP antes?', type: 'select', options: [{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }], section: '8. ICP' },
  { id: 'baseDados', question: 'Se sim, as infos são baseadas em dados reais ou média de clientes?', placeholder: 'Dados reais ou estimativas...', type: 'text', section: '8. ICP' },
  { id: 'instagramMelhoresClientes', question: 'Instagram dos 3 melhores clientes que você já atendeu:', placeholder: '@cliente1\n@cliente2\n@cliente3', type: 'textarea', section: '8. ICP' },
  { id: 'tipoClientePrincipal', question: 'Tipo de cliente principal:', type: 'select', options: [{ value: 'pessoaFisica', label: 'Pessoa física' }, { value: 'empresa', label: 'Empresa (B2B)' }, { value: 'ambos', label: 'Ambos' }], section: '8. ICP' },
  { id: 'descricaoPublicoAlvo', question: 'Descreva seu público alvo em detalhes:', placeholder: 'Perfil completo do cliente ideal...', type: 'textarea', section: '8. ICP' },
  { id: 'top5Dores', question: 'Top 5 dores (com exemplos reais):', placeholder: '1. Dor...\n2. Dor...\n3. Dor...\n4. Dor...\n5. Dor...', type: 'textarea', section: '8. ICP' },
  { id: 'top5Desejos', question: 'Top 5 desejos (com exemplos reais):', placeholder: '1. Desejo...\n2. Desejo...\n3. Desejo...\n4. Desejo...\n5. Desejo...', type: 'textarea', section: '8. ICP' },
  { id: 'ondeICPVive', question: 'Onde esse ICP vive (atenção): Instagram, TikTok, YouTube, LinkedIn, Google, grupos, eventos, podcasts, newsletters?', placeholder: 'Liste os canais com links se possível...', type: 'textarea', section: '8. ICP' },
  { id: 'quemInfluenciaDecisao', question: 'Quem influencia a decisão de compra?', placeholder: 'Ex: cônjuge, sócio, mentor...', type: 'textarea', section: '8. ICP' },
  { id: 'nivelConsciencia', question: 'Nível de consciência do lead sobre o problema/solução:', type: 'select', options: [{ value: 'baixo', label: 'Baixo' }, { value: 'medio', label: 'Médio' }, { value: 'alto', label: 'Alto' }], section: '8. ICP' },
  { id: 'oqueBuscaGoogle', question: 'O que ele busca no Google/internet quando procura sua solução?', placeholder: 'Termos de busca...', type: 'textarea', section: '8. ICP' },
  { id: 'porqueCompram', question: 'Por que eles compram seu serviço? Qual dor faz investir?', placeholder: 'Motivação principal de compra...', type: 'textarea', section: '8. ICP' },
  { id: 'lugaresFrequentam', question: 'Lugares que frequentam no tempo livre:', placeholder: 'Ex: academia, restaurantes, eventos...', type: 'textarea', section: '8. ICP' },
  { id: 'marcasConsumem', question: 'Quais marcas eles consomem no dia a dia?', placeholder: 'Marcas que admiram e compram...', type: 'textarea', section: '8. ICP' },
  { id: 'medosProfundos', question: 'Medos mais profundos:', placeholder: 'Medos que não falam em público...', type: 'textarea', section: '8. ICP' },
  { id: 'momentoVidaAtual', question: 'Momento de vida atual:', placeholder: 'Fase da vida, contexto...', type: 'textarea', section: '8. ICP' },
  { id: 'experienciaIdeal', question: 'Como seria a experiência ideal do cliente com sua marca (do primeiro contato ao pós-venda)?', placeholder: 'Jornada ideal...', type: 'textarea', section: '8. ICP' },
  { id: 'problemaResolver', question: 'Se você pudesse resolver 1 problema do seu público hoje, qual seria?', placeholder: 'O problema mais urgente...', type: 'textarea', section: '8. ICP' },
  { id: 'perfilEvitar', question: 'Existe um perfil de cliente que você prefere evitar? Qual?', placeholder: 'Clientes que não quer atender...', type: 'textarea', section: '8. ICP' },
  // 8.3 Dores profundas
  { id: 'dorSilenciosa', question: 'Dor mais silenciosa/incômoda relacionada ao serviço:', placeholder: 'A dor que não falam...', type: 'textarea', section: '8.3 Dores Profundas' },
  { id: 'pensamentosSozinha', question: 'Pensamentos que a pessoa tem sozinha e não fala:', placeholder: 'Pensamentos internos...', type: 'textarea', section: '8.3 Dores Profundas' },
  { id: 'tentaNaoFunciona', question: 'O que ela tenta fazer e não funciona:', placeholder: 'Tentativas frustradas...', type: 'textarea', section: '8.3 Dores Profundas' },
  { id: 'medoContinuar', question: 'Medo se continuar do mesmo jeito:', placeholder: 'Consequências de não agir...', type: 'textarea', section: '8.3 Dores Profundas' },
  { id: 'palavraComoSeSente', question: 'Em 1 palavra: como ela se sente?', placeholder: 'Ex: Frustrada', type: 'text', section: '8.3 Dores Profundas' },
  // 8.4 Sonhos
  { id: 'conquistar6Meses', question: 'O que ela quer conquistar nos próximos 6 meses?', placeholder: 'Objetivos de curto prazo...', type: 'textarea', section: '8.4 Sonhos' },
  { id: 'comoQuerSeSentir', question: 'Como ela quer se sentir ao conquistar isso?', placeholder: 'Sentimento desejado...', type: 'textarea', section: '8.4 Sonhos' },
  { id: 'oqueAcreditaPrecisa', question: 'O que ela acredita que precisa para chegar lá?', placeholder: 'Crenças sobre o caminho...', type: 'textarea', section: '8.4 Sonhos' },
  { id: 'comprariaSemPensar', question: 'O que ela compraria sem pensar duas vezes se tivesse certeza que funciona?', placeholder: 'Solução dos sonhos...', type: 'textarea', section: '8.4 Sonhos' },
  // 8.5 Comportamento
  { id: 'oqueObservaConfiar', question: 'O que ela observa antes de confiar numa marca?', placeholder: 'Critérios de confiança...', type: 'textarea', section: '8.5 Comportamento' },
  { id: 'jaComprouParecido', question: 'Já comprou algo parecido? Como foi a experiência?', placeholder: 'Experiências anteriores...', type: 'textarea', section: '8.5 Comportamento' },
  { id: 'comoFalaDiaDia', question: 'Como ela fala no dia a dia? Quais palavras usa/não usa?', placeholder: 'Linguagem cotidiana...', type: 'textarea', section: '8.5 Comportamento' },
  { id: 'mensagemEmociona', question: 'Que tipo de mensagem emociona ela?', placeholder: 'O que toca o coração...', type: 'textarea', section: '8.5 Comportamento' },
  { id: 'linguagemConecta', question: 'Que tipo de linguagem sua audiência mais conecta no digital?', placeholder: 'Forma de comunicar que funciona...', type: 'textarea', section: '8.5 Comportamento' },
  // 8.6 Transformação
  { id: 'personaAntes', question: 'Como a persona está antes de te conhecer? (pensamentos, sentimentos, comportamentos)', placeholder: 'Estado antes da transformação...', type: 'textarea', section: '8.6 Transformação' },
  { id: 'resultadosPraticos', question: 'Quais resultados práticos ela alcança + como ela se sente + o que consegue fazer que antes não conseguia?', placeholder: 'Transformação completa...', type: 'textarea', section: '8.6 Transformação' },
  { id: 'feedbackInesquecivel', question: 'Qual foi o feedback mais inesquecível que você já recebeu?', placeholder: 'Depoimento marcante...', type: 'textarea', section: '8.6 Transformação' },
  { id: 'bastidoresConteudo', question: 'Que bastidores, erros ou momentos reais merecem virar conteúdo?', placeholder: 'Histórias autênticas...', type: 'textarea', section: '8.6 Transformação' },

  // SEÇÃO 9: PREFERÊNCIAS DE CONTEÚDO
  { id: 'maiorObjetivoRedes', question: 'Maior objetivo com redes sociais hoje:', placeholder: 'O que quer alcançar...', type: 'textarea', section: '9. Preferências' },
  { id: 'primeiraImpressao', question: 'Primeira impressão ideal ao entrar no seu perfil:', placeholder: 'O que a pessoa deve sentir/pensar...', type: 'textarea', section: '9. Preferências' },
  { id: 'marcasCollab', question: 'Quais marcas você gostaria de fazer collab no futuro?', placeholder: 'Marcas para parcerias...', type: 'textarea', section: '9. Preferências' },
  { id: 'abertoInfluenciadores', question: 'Você está aberto(a) a parceria com influenciadores?', type: 'select', options: [{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }], section: '9. Preferências' },
  { id: 'influenciadoresLista', question: 'Se sim, liste: nome + link + motivo', placeholder: '@influenciador - motivo...', type: 'textarea', section: '9. Preferências' },
  { id: 'verdadesPolemicas', question: 'Verdades polêmicas que você gostaria de abordar:', placeholder: 'Temas controversos...', type: 'textarea', section: '9. Preferências' },
  { id: 'quemVaiGravar', question: 'Quem vai gravar os conteúdos? Essa pessoa tem facilidade com câmera?', placeholder: 'Responsável pela gravação...', type: 'textarea', section: '9. Preferências' },
  { id: 'oqueGostaProduzir', question: 'O que você mais gosta de produzir? E o que menos gosta?', placeholder: 'Preferências de produção...', type: 'textarea', section: '9. Preferências' },
  { id: 'formatoEvita', question: 'Existe algum formato que você evita ou tem dificuldade? Qual?', placeholder: 'Formatos que não gosta...', type: 'text', section: '9. Preferências' },
  { id: 'metricasImportam', question: 'Métricas que mais importam para você:', placeholder: 'KPIs prioritários...', type: 'textarea', section: '9. Preferências' },
  { id: 'plataformasUsaExplorar', question: 'Quais plataformas você usa hoje e quais quer explorar?', placeholder: 'Atuais e futuras...', type: 'textarea', section: '9. Preferências' },
  { id: 'jaInvestiuTrafego', question: 'Já investiu em tráfego pago? O que funcionou e o que não funcionou?', placeholder: 'Experiência com ads...', type: 'textarea', section: '9. Preferências' },
  { id: 'restricaoLegal', question: 'No seu nicho há alguma restrição legal? (Ex: OAB, medicina)', placeholder: 'Restrições do setor...', type: 'textarea', section: '9. Preferências' },
  // 9.1 Produção
  { id: 'orcamentoMensal', question: 'Orçamento mensal para impulsionar conteúdo (R$):', placeholder: 'Ex: R$ 1.000', type: 'text', section: '9.1 Produção' },
  { id: 'frequenciaDesejada', question: 'Frequência desejada: 3x/semana, 5x/semana etc. + formatos', placeholder: 'Ex: 5x/semana - 3 Reels + 2 Stories', type: 'text', section: '9.1 Produção' },
  { id: 'quadroFixo', question: 'Já existe algum quadro fixo/serie ativa que quer manter?', placeholder: 'Series existentes...', type: 'textarea', section: '9.1 Produção' },
  { id: 'uploadCronogramas', question: 'Link de cronogramas antigos que você gostou (se tiver):', placeholder: 'Link do arquivo...', type: 'text', section: '9.1 Produção' },
  // 9.2 Configurações
  { id: 'plataformasPrioritarias', question: 'Plataformas prioritárias (até 3):', type: 'multiselect', options: [
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtubeShorts', label: 'YouTube Shorts' },
    { value: 'youtubeLongo', label: 'YouTube longo' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'blog', label: 'Blog/SEO' },
    { value: 'email', label: 'E-mail' },
    { value: 'threads', label: 'Threads' },
    { value: 'podcast', label: 'Podcast' },
  ], section: '9.2 Configurações' },
  { id: 'formatosConsegueProduzir', question: 'Formatos que você consegue produzir:', type: 'multiselect', options: [
    { value: 'reelsFalando', label: 'Reels falando' },
    { value: 'cortes', label: 'Cortes' },
    { value: 'entrevistas', label: 'Entrevistas' },
    { value: 'vlog', label: 'Vlog' },
    { value: 'bastidores', label: 'Bastidores' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'carrossel', label: 'Carrossel' },
    { value: 'live', label: 'Live' },
    { value: 'stories', label: 'Stories' },
    { value: 'textoLinkedin', label: 'Texto LinkedIn' },
    { value: 'blog', label: 'Blog' },
  ], section: '9.2 Configurações' },
  { id: 'recursosDisponiveis', question: 'Recursos disponíveis: editor / designer / social media / estúdio / celular / tempo do porta-voz', placeholder: 'Liste os recursos...', type: 'textarea', section: '9.2 Configurações' },
  { id: 'rostoConteudo', question: 'Quem é o rosto do conteúdo?', type: 'select', options: [
    { value: 'fundador', label: 'Fundador(a)' },
    { value: 'time', label: 'Time' },
    { value: 'ugc', label: 'UGC-clientes' },
    { value: 'semRosto', label: 'Sem rosto' },
  ], section: '9.2 Configurações' },
  { id: 'pautasPodeFalar', question: 'Pautas que a marca PODE falar e o público ama:', placeholder: 'Temas permitidos...', type: 'textarea', section: '9.2 Configurações' },
  { id: 'pautasNaoQuerFalar', question: 'Pautas que a marca NÃO quer falar:', placeholder: 'Temas proibidos...', type: 'textarea', section: '9.2 Configurações' },
  { id: 'lancamentos90Dias', question: 'Produtos/lançamentos/agenda dos próximos 90 dias (com datas):', placeholder: 'Calendário de lançamentos...', type: 'textarea', section: '9.2 Configurações' },
  { id: 'ctasPermitidos', question: 'CTAs permitidos:', type: 'multiselect', options: [
    { value: 'comentarPalavra', label: 'Comentar palavra-chave' },
    { value: 'clicarLink', label: 'Clicar no link' },
    { value: 'chamarWhatsapp', label: 'Chamar no WhatsApp' },
    { value: 'baixarMaterial', label: 'Baixar material' },
    { value: 'agendarCall', label: 'Agendar call' },
    { value: 'entrarLista', label: 'Entrar na lista' },
  ], section: '9.2 Configurações' },
  { id: 'iscasExistentes', question: 'Tem alguma isca existente? (links + descrição)', placeholder: 'Iscas digitais...', type: 'textarea', section: '9.2 Configurações' },
  { id: 'top10Mitos', question: 'Top 10 mitos/erros do mercado:', placeholder: '1. Mito...\n2. Mito...', type: 'textarea', section: '9.2 Configurações' },
  { id: 'top10Cases', question: 'Top 10 histórias/cases internos (com números se possível):', placeholder: '1. Case...\n2. Case...', type: 'textarea', section: '9.2 Configurações' },
  { id: 'recadoFinal', question: 'Recado final: algo que você quer que o agente saiba e não foi perguntado', placeholder: 'Informações extras...', type: 'textarea', section: '9.2 Configurações' },

  // SEÇÃO 10: REFERÊNCIAS
  { id: 'referenciasGringas', question: 'Referências gringas: link + o que te atrai nelas', placeholder: 'Links e motivos...', type: 'textarea', section: '10. Referências' },
  { id: 'referenciasNaoGosta', question: '3 referências de posicionamento que você NÃO gosta: links + por quê', placeholder: 'O que não quer parecer...', type: 'textarea', section: '10. Referências' },
  { id: 'referenciasGosta', question: '3 referências que você gosta: links + o que copiar (conteúdo, formato, estética)', placeholder: 'Inspirações...', type: 'textarea', section: '10. Referências' },
  { id: 'conteudoIdealMistura', question: 'Se você misturasse todas as referências citadas, como seria o conteúdo ideal?', placeholder: 'Descrição do conteúdo dos sonhos...', type: 'textarea', section: '10. Referências' },
];

const initialFormData: FormData = {
  razaoSocial: '', nomeFantasia: '', cnpj: '', dataFundacao: '', siteInstitucional: '',
  estadosCidades: '', paisesInternacional: '', temSedeFisica: '', enderecoSede: '',
  segmentoEspecifico: '', faturamentoAnual: '', instagram: '', tiktok: '', youtubeShorts: '',
  threads: '', reclameAqui: '', googleMeuNegocio: '', outrosCanais: '', oQueEEmpresa: '',
  historiaEmpresa: '', sociosFundadores: '', missao: '', visao: '', valores: '', contraValores: '',
  legado: '', grandeSonho: '', temPlanoNegocio: '', uploadPlanoNegocio: '', sabeMarketShare: '',
  marketShareNumero: '', planejamentoMarketing: '', uploadPlanejamento: '', metasIndicadores: '',
  forcasVantagens: '', fraquezas: '', ameacas: '', oportunidades: '', calendarioAnual: '',
  temSazonalidade: '', explicacaoSazonalidade: '', mesesVendasCaem: '', tendenciasMercado: '',
  previsoesEspecialistas: '', fatoresPoliticos: '', fatoresEconomicos: '', fatoresSociais: '',
  fatoresTecnologicos: '', fatoresAmbientais: '', fatoresLegais: '', noticiasRecentes: '',
  modeloVendas: '', origemClientes: [], produtoPrioritario: '', canaisMaisTrazem: '',
  capacidadeEntrega: '', gargalos: [], faqTop10: '', pontosCaptura: [], taxaVisitaLead: '',
  taxaLeadCall: '', taxaCallVenda: '', cac: '', ticketMedio: '', ltv: '', churn: '',
  processoFollowUp: '', argumentosVenda: '', motivosNaoFechamento: '', concorrentesDiretos: '',
  ondeSaoMelhores: '', fatoresEscolhaConcorrencia: '', diferenciaisMelhor: '', concorrentesIndiretos: '',
  products: [createEmptyProduct()], slogan: '', uploadBrandbook: '', uploadLogo: '',
  arquetipoMarca: '', personalidadeMarca: '', palavrasChaveMarca: '', palavrasNaoDescrevem: '',
  tomDeVoz: [], palavrasEvitar: '', guiaEmojis: '', frasesEngracadas: '', temPosicionamentoPolitico: '',
  explicacaoPosicionamento: '', opinioesFortes: '', temMetodologiaPropria: '', etapasMetodologia: '',
  politicaCrise: '', jaFezEstudoICP: '', baseDados: '', instagramMelhoresClientes: '',
  tipoClientePrincipal: '', descricaoPublicoAlvo: '', top5Dores: '', top5Desejos: '',
  ondeICPVive: '', quemInfluenciaDecisao: '', nivelConsciencia: '', oqueBuscaGoogle: '',
  porqueCompram: '', lugaresFrequentam: '', marcasConsumem: '', medosProfundos: '',
  momentoVidaAtual: '', experienciaIdeal: '', problemaResolver: '', perfilEvitar: '',
  dorSilenciosa: '', pensamentosSozinha: '', tentaNaoFunciona: '', medoContinuar: '',
  palavraComoSeSente: '', conquistar6Meses: '', comoQuerSeSentir: '', oqueAcreditaPrecisa: '',
  comprariaSemPensar: '', oqueObservaConfiar: '', jaComprouParecido: '', comoFalaDiaDia: '',
  mensagemEmociona: '', linguagemConecta: '', personaAntes: '', resultadosPraticos: '',
  feedbackInesquecivel: '', bastidoresConteudo: '', maiorObjetivoRedes: '', primeiraImpressao: '',
  marcasCollab: '', abertoInfluenciadores: '', influenciadoresLista: '', verdadesPolemicas: '',
  quemVaiGravar: '', oqueGostaProduzir: '', formatoEvita: '', metricasImportam: '',
  plataformasUsaExplorar: '', jaInvestiuTrafego: '', restricaoLegal: '', orcamentoMensal: '',
  frequenciaDesejada: '', quadroFixo: '', uploadCronogramas: '', plataformasPrioritarias: [],
  formatosConsegueProduzir: [], recursosDisponiveis: '', rostoConteudo: '', pautasPodeFalar: '',
  pautasNaoQuerFalar: '', lancamentos90Dias: '', ctasPermitidos: [], iscasExistentes: '',
  top10Mitos: '', top10Cases: '', recadoFinal: '', referenciasGringas: '', referenciasNaoGosta: '',
  referenciasGosta: '', conteudoIdealMistura: '',
};

export default function CompleteBriefingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Form submitted:', formData);
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/onboarding');
    }
  };

  const handleInputChange = (value: string | string[]) => {
    setFormData({ ...formData, [currentQuestion.id]: value });
  };

  const handleProductChange = (field: keyof Product, value: string) => {
    const newProducts = [...formData.products];
    newProducts[currentProductIndex] = { ...newProducts[currentProductIndex], [field]: value };
    setFormData({ ...formData, products: newProducts });
  };

  const addProduct = () => {
    setFormData({ ...formData, products: [...formData.products, createEmptyProduct()] });
    setCurrentProductIndex(formData.products.length);
  };

  const removeProduct = (index: number) => {
    if (formData.products.length > 1) {
      const newProducts = formData.products.filter((_, i) => i !== index);
      setFormData({ ...formData, products: newProducts });
      if (currentProductIndex >= newProducts.length) {
        setCurrentProductIndex(newProducts.length - 1);
      }
    }
  };

  const renderProductsSection = () => {
    const product = formData.products[currentProductIndex];
    const productFields: { key: keyof Product; label: string; placeholder: string }[] = [
      { key: 'nome', label: 'Nome do produto/serviço', placeholder: 'Ex: Consultoria Premium' },
      { key: 'descricao', label: 'Descrição (o que é e para quem é)', placeholder: 'Descreva o produto...' },
      { key: 'preco', label: 'Preço', placeholder: 'Ex: R$ 2.000' },
      { key: 'formasPagamento', label: 'Formas de pagamento', placeholder: 'Ex: PIX, cartão em até 12x' },
      { key: 'categoria', label: 'Categoria (entrada/principal/recorrência/upsell)', placeholder: 'Ex: Produto principal' },
      { key: 'entrega', label: 'Como é a entrega na prática? (etapas + prazo)', placeholder: 'Descreva o processo...' },
      { key: 'incluso', label: 'O que está incluso', placeholder: 'Liste o que está incluso...' },
      { key: 'naoIncluso', label: 'O que NÃO está incluso', placeholder: 'Liste o que não está incluso...' },
      { key: 'porqueComprar', label: 'Por que as pessoas deveriam comprar isso de você?', placeholder: 'Motivos para comprar...' },
      { key: 'garantia', label: 'Existe garantia? Qual?', placeholder: 'Ex: 7 dias de garantia' },
      { key: 'lpLink', label: 'LP ou site específico do produto (link)', placeholder: 'https://...' },
      { key: 'provasSociais', label: 'Provas sociais / feedbacks (links)', placeholder: 'Links de depoimentos...' },
      { key: 'outrasInfos', label: 'Algo importante que não foi perguntado?', placeholder: 'Informações extras...' },
    ];

    return (
      <div className="space-y-4">
        {/* Product Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {formData.products.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setCurrentProductIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all ${
                currentProductIndex === idx
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Produto {idx + 1}
              {formData.products.length > 1 && (
                <Trash2
                  className="w-3 h-3 hover:text-red-400"
                  onClick={(e) => { e.stopPropagation(); removeProduct(idx); }}
                />
              )}
            </button>
          ))}
          <button
            onClick={addProduct}
            className="px-3 py-1.5 rounded-lg text-sm bg-amber-100 text-amber-700 hover:bg-amber-200 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Adicionar
          </button>
        </div>

        {/* Product Fields - Show 2 at a time */}
        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
          {productFields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-slate-600 mb-1">{field.label}</label>
              <input
                type="text"
                value={product[field.key]}
                onChange={(e) => handleProductChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-400 focus:ring-0 outline-none text-slate-800 text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderInput = () => {
    if (currentQuestion.type === 'products') {
      return renderProductsSection();
    }

    switch (currentQuestion.type) {
      case 'text':
        return (
          <input
            type="text"
            value={formData[currentQuestion.id as keyof FormData] as string}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-0 outline-none text-slate-800 transition-colors"
            autoFocus
          />
        );

      case 'textarea':
        return (
          <textarea
            value={formData[currentQuestion.id as keyof FormData] as string}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={currentQuestion.placeholder}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-0 outline-none text-slate-800 transition-colors resize-none"
            autoFocus
          />
        );

      case 'select':
        return (
          <div className="space-y-2">
            {currentQuestion.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => handleInputChange(option.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-left transition-all text-sm ${
                  formData[currentQuestion.id as keyof FormData] === option.value
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        );

      case 'multiselect':
        const selectedValues = (formData[currentQuestion.id as keyof FormData] as string[]) || [];
        return (
          <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
            {currentQuestion.options?.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    const newValues = isSelected
                      ? selectedValues.filter((v) => v !== option.value)
                      : [...selectedValues, option.value];
                    handleInputChange(newValues);
                  }}
                  className={`px-3 py-2 rounded-xl border text-left transition-all text-sm ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isSelected && <Check className="w-3 h-3" />}
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-slate-900 text-sm">Symponhy</span>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Voltar
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="px-4 flex-shrink-0">
        <div className="max-w-xl mx-auto">
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-400">
              {currentStep + 1} de {questions.length}
            </span>
            <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Briefing Master
            </span>
          </div>
        </div>
      </div>

      {/* Section Badge */}
      <div className="px-4 mt-2 flex-shrink-0">
        <div className="max-w-xl mx-auto">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
            {currentQuestion.section}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 py-2 min-h-0">
        {/* Oracle Sphere */}
        <div className="relative mb-2 flex-shrink-0">
          <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-xl scale-150" />
          <FloatingOracle size={80} />
        </div>

        {/* Question */}
        <div className="w-full max-w-xl flex-1 flex flex-col min-h-0">
          <h2 className="text-lg font-semibold text-slate-900 text-center mb-3 flex-shrink-0">
            {currentQuestion.question}
          </h2>

          {/* Input */}
          <div className="flex-1 min-h-0 overflow-hidden">{renderInput()}</div>

          {/* Navigation */}
          <div className="flex justify-between pt-3 flex-shrink-0">
            <button
              onClick={handleBack}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors text-sm"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 rounded-xl font-medium flex items-center gap-2 transition-all bg-slate-900 text-white hover:bg-slate-800 text-sm"
            >
              {currentStep === questions.length - 1 ? (
                <>
                  Finalizar
                  <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Próxima
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
