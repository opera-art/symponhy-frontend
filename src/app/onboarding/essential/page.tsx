'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { FieldComments } from '@/components/onboarding/FieldComments';
import { BriefingPreview } from '@/components/onboarding/BriefingPreview';
import { Check, Mic, MicOff, Glasses, MessageCircle } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useVoiceInput } from '@/hooks/useVoiceInput';

interface FormData {
  // Dados básicos
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  dataFundacao: string;
  siteInstitucional: string;
  estadosCidades: string;
  paisesInternacionais: string;
  temSedeFixa: string;
  enderecoSede: string;
  segmentoEspecifico: string;
  faturamentoAnual: string;

  // Redes sociais
  instagram: string;
  tiktok: string;
  youtubeShorts: string;
  threads: string;
  reclameAqui: string;
  googleMeuNegocio: string;
  outrosCanais: string;

  // Identidade
  oQueFaz: string;
  paraQuem: string;
  comoComecou: string;
  missao: string;
  visao3a5Anos: string;
  valores: string;

  // Oferta prioritária
  produtoPrioritario: string;
  precoProduto: string;
  formasPagamento: string[];
  oQueIncluso: string;
  oQueNaoIncluso: string;
  transformacaoEntrega: string;
  temProvasSociais: string;
  linksProvasSociais: string;
  linkPaginaProduto: string;

  // Cliente ideal
  tipoCliente: string;
  clienteIdeal: string;
  tresDores: string;
  tresDesejos: string;
  tresObjecoes: string;
  frasesCliente: string;
  ondeClienteVive: string[];
  pesquisasGoogle: string;

  // Funil e vendas
  comoClienteChega: string[];
  proximoPasso: string[];
  capacidadeEntrega: string;
  maioresGargalos: string[];
  faqPerguntas: string;
  porQueNaoFecham: string;
  sabeNumeros: string;
  ticketMedio: string;
  cac: string;
  taxaConversao: string;

  // Marca e comunicação
  tomMarca: string[];
  palavrasUsaMuito: string;
  palavrasEvita: string;
  temasProibidos: string;
  verdadeIncomoda: string;
  comoRespondeCriticas: string;

  // Conteúdo e produção
  objetivoRedes: string[];
  primeiraImpressao: string;
  plataformasPrioritarias: string[];
  frequenciaDesejada: string;
  formatosConsegueProduzir: string[];
  rostoConteudo: string[];
  quemGrava: string;
  temEditor: string;
  quadroSerie: string;
  qualQuadro: string;
  ctasPermitidos: string[];
  temLeadMagnet: string;
  linkLeadMagnet: string;
  temasPublicoAma: string;
  agenda90Dias: string;

  // Concorrência
  concorrentesDiretos: string;
  ondeConcorrentesMelhores: string;
  porQueEscolhemVoce: string;
  referenciasConteudo: string;
  oQueQuerCopiar: string;
  referenciaNaoGosta: string;

  // Final
  algoMais: string;
  restricaoLegal: string;
}

const sections = [
  {
    title: 'Dados Básicos',
    questions: [
      { id: 'razaoSocial', question: 'Razão social', type: 'text', placeholder: 'Nome legal da empresa' },
      { id: 'nomeFantasia', question: 'Nome fantasia / nome comercial', type: 'text', placeholder: 'Como sua marca é conhecida' },
      { id: 'cnpj', question: 'CNPJ (opcional)', type: 'text', placeholder: '00.000.000/0000-00' },
      { id: 'dataFundacao', question: 'Data de fundação da empresa', type: 'date', placeholder: '' },
      { id: 'siteInstitucional', question: 'Site institucional', type: 'url', placeholder: 'https://seusite.com.br' },
      { id: 'estadosCidades', question: 'Quais estados/cidades você atende?', type: 'textarea', placeholder: 'Ex: São Paulo, Rio de Janeiro, Minas Gerais...' },
      { id: 'paisesInternacionais', question: 'Se internacional: quais países?', type: 'text', placeholder: 'Ex: EUA, Portugal, México...' },
      { id: 'temSedeFixa', question: 'A empresa tem sede física fixa?', type: 'select', options: [
        { value: 'sim', label: 'Sim' },
        { value: 'nao', label: 'Não' },
      ]},
      { id: 'enderecoSede', question: 'Endereço da sede (se tiver)', type: 'text', placeholder: 'Rua, número, cidade, estado' },
      { id: 'segmentoEspecifico', question: 'Qual é o segmento específico da empresa?', type: 'text', placeholder: 'Ex: clínica de estética, consultoria financeira, agência de tráfego...' },
      { id: 'faturamentoAnual', question: 'Faturamento anual atual (estimativa)', type: 'select', options: [
        { value: 'ate100k', label: 'Até R$ 100 mil' },
        { value: '100k-500k', label: 'R$ 100 mil - R$ 500 mil' },
        { value: '500k-1m', label: 'R$ 500 mil - R$ 1 milhão' },
        { value: '1m-5m', label: 'R$ 1 milhão - R$ 5 milhões' },
        { value: '5m+', label: 'Acima de R$ 5 milhões' },
      ]},
    ],
  },
  {
    title: 'Redes Sociais',
    questions: [
      { id: 'instagram', question: 'Instagram', type: 'url', placeholder: 'instagram.com/suamarca' },
      { id: 'tiktok', question: 'TikTok', type: 'url', placeholder: 'tiktok.com/@suamarca' },
      { id: 'youtubeShorts', question: 'YouTube Shorts', type: 'url', placeholder: 'youtube.com/@suamarca' },
      { id: 'threads', question: 'Threads', type: 'url', placeholder: 'threads.net/@suamarca' },
      { id: 'reclameAqui', question: 'Reclame Aqui', type: 'url', placeholder: 'Link do perfil' },
      { id: 'googleMeuNegocio', question: 'Google Meu Negócio', type: 'url', placeholder: 'Link do perfil' },
      { id: 'outrosCanais', question: 'Outros canais (YouTube longo, LinkedIn, Blog, Pinterest, E-mail, Podcast)', type: 'textarea', placeholder: 'Cole os links dos outros canais, um por linha' },
    ],
  },
  {
    title: 'Identidade',
    questions: [
      { id: 'oQueFaz', question: 'O que sua empresa faz?', type: 'textarea', placeholder: 'Descreva em poucas palavras o que vocês fazem' },
      { id: 'paraQuem', question: 'Para quem você faz isso?', type: 'textarea', placeholder: 'Quem são seus clientes' },
      { id: 'comoComecou', question: 'Como a empresa começou? (resumo em 3-6 linhas)', type: 'textarea', placeholder: 'Conte brevemente a história da empresa' },
      { id: 'missao', question: 'Qual é a missão da empresa?', type: 'textarea', placeholder: 'Pode ser informal' },
      { id: 'visao3a5Anos', question: 'Onde você quer estar em 3-5 anos?', type: 'textarea', placeholder: 'Qual resultado você quer alcançar' },
      { id: 'valores', question: 'Quais são os valores da empresa?', type: 'text', placeholder: 'Ex: transparência, agilidade, excelência...' },
    ],
  },
  {
    title: 'Oferta Principal',
    questions: [
      { id: 'produtoPrioritario', question: 'Qual é o produto/serviço PRIORITÁRIO para os próximos 90 dias?', type: 'textarea', placeholder: 'O que vamos vender no conteúdo' },
      { id: 'precoProduto', question: 'Quanto custa esse produto/serviço?', type: 'text', placeholder: 'Valor ou faixa de preço' },
      { id: 'formasPagamento', question: 'Como o cliente paga hoje?', type: 'multiselect', options: [
        { value: 'pix', label: 'Pix' },
        { value: 'cartao_avista', label: 'Cartão à vista' },
        { value: 'parcelado', label: 'Parcelado' },
        { value: 'assinatura', label: 'Assinatura' },
        { value: 'boleto', label: 'Boleto' },
        { value: 'outro', label: 'Outro' },
      ]},
      { id: 'oQueIncluso', question: 'O que está incluso na entrega?', type: 'textarea', placeholder: 'Liste o que o cliente recebe' },
      { id: 'oQueNaoIncluso', question: 'O que NÃO está incluso?', type: 'textarea', placeholder: 'O que não faz parte da entrega' },
      { id: 'transformacaoEntrega', question: 'Em 1 frase: qual transformação/resultado esse produto entrega?', type: 'text', placeholder: 'A promessa principal' },
      { id: 'temProvasSociais', question: 'Você tem provas sociais desse produto?', type: 'select', options: [
        { value: 'sim', label: 'Sim' },
        { value: 'nao', label: 'Não' },
      ]},
      { id: 'linksProvasSociais', question: 'Links das provas sociais (Drive/Notion/Instagram)', type: 'textarea', placeholder: 'Cole os links dos depoimentos' },
      { id: 'linkPaginaProduto', question: 'Link da página/WhatsApp/checkout (se existir)', type: 'url', placeholder: 'https://...' },
    ],
  },
  {
    title: 'Cliente Ideal',
    questions: [
      { id: 'tipoCliente', question: 'Você vende principalmente para:', type: 'select', options: [
        { value: 'pf', label: 'Pessoa física' },
        { value: 'pj', label: 'Empresa (B2B)' },
        { value: 'ambos', label: 'Ambos' },
      ]},
      { id: 'clienteIdeal', question: 'Descreva seu cliente ideal (quem é + contexto)', type: 'textarea', placeholder: 'Perfil detalhado do seu cliente ideal' },
      { id: 'tresDores', question: 'Quais são as 3 maiores dores desse cliente? (com exemplo real)', type: 'textarea', placeholder: 'O que mais incomoda seu cliente' },
      { id: 'tresDesejos', question: 'Quais são os 3 maiores desejos desse cliente?', type: 'textarea', placeholder: 'O que seu cliente mais quer' },
      { id: 'tresObjecoes', question: 'Quais são as 3 objeções mais comuns antes de comprar?', type: 'textarea', placeholder: 'O que impede a compra' },
      { id: 'frasesCliente', question: 'Escreva 5 frases reais que o cliente fala (do jeito que ele fala)', type: 'textarea', placeholder: 'Copie falas reais dos seus clientes' },
      { id: 'ondeClienteVive', question: 'Onde esse cliente mais "vive" (atenção)?', type: 'multiselect', options: [
        { value: 'instagram', label: 'Instagram' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'youtube', label: 'YouTube' },
        { value: 'google', label: 'Google' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'whatsapp', label: 'Grupos WhatsApp/Telegram' },
        { value: 'eventos', label: 'Eventos' },
        { value: 'podcasts', label: 'Podcasts' },
      ]},
      { id: 'pesquisasGoogle', question: 'O que esse cliente pesquisa no Google? (3-10 termos)', type: 'textarea', placeholder: 'Termos de busca que ele usa' },
    ],
  },
  {
    title: 'Funil de Vendas',
    questions: [
      { id: 'comoClienteChega', question: 'Como o cliente chega hoje?', type: 'multiselect', options: [
        { value: 'organico', label: 'Orgânico redes' },
        { value: 'indicacao', label: 'Indicação' },
        { value: 'trafego_pago', label: 'Tráfego pago' },
        { value: 'google_seo', label: 'Google/SEO' },
        { value: 'parcerias', label: 'Parcerias' },
        { value: 'outbound', label: 'Outbound' },
      ]},
      { id: 'proximoPasso', question: 'Qual é o "próximo passo" que você quer que o cliente faça?', type: 'multiselect', options: [
        { value: 'dm', label: 'Mandar DM' },
        { value: 'link', label: 'Clicar no link' },
        { value: 'whatsapp', label: 'Chamar no WhatsApp' },
        { value: 'formulario', label: 'Preencher formulário' },
        { value: 'call', label: 'Agendar call' },
        { value: 'comprar', label: 'Comprar direto' },
      ]},
      { id: 'capacidadeEntrega', question: 'Qual a sua capacidade de entrega hoje? (clientes por mês)', type: 'text', placeholder: 'Número estimado' },
      { id: 'maioresGargalos', question: 'Marque os 2-3 maiores gargalos hoje', type: 'multiselect', options: [
        { value: 'falta_leads', label: 'Falta de leads' },
        { value: 'leads_ruins', label: 'Leads ruins' },
        { value: 'baixa_conversao', label: 'Baixa conversão' },
        { value: 'ticket_baixo', label: 'Ticket baixo' },
        { value: 'pouca_prova', label: 'Pouca prova social' },
        { value: 'comercial_fraco', label: 'Processo comercial fraco' },
        { value: 'churn', label: 'Churn' },
        { value: 'oferta_confusa', label: 'Oferta confusa' },
        { value: 'falta_conteudo', label: 'Falta de conteúdo' },
        { value: 'operacao', label: 'Operação desorganizada' },
      ]},
      { id: 'faqPerguntas', question: 'Quais são as 10 perguntas mais comuns antes de comprar? (FAQ real)', type: 'textarea', placeholder: 'Liste as perguntas frequentes' },
      { id: 'porQueNaoFecham', question: 'Por que as pessoas NÃO fecham? (motivo nº1)', type: 'textarea', placeholder: 'Principal razão de não comprar' },
      { id: 'sabeNumeros', question: 'Você sabe seus números?', type: 'select', options: [
        { value: 'sim', label: 'Sim' },
        { value: 'nao', label: 'Não' },
      ]},
      { id: 'ticketMedio', question: 'Ticket médio', type: 'text', placeholder: 'R$ 0,00' },
      { id: 'cac', question: 'CAC (Custo de Aquisição)', type: 'text', placeholder: 'R$ 0,00' },
      { id: 'taxaConversao', question: 'Taxa call → venda (%)', type: 'text', placeholder: '0%' },
    ],
  },
  {
    title: 'Comunicação',
    questions: [
      { id: 'tomMarca', question: 'Como você quer que a marca soe?', type: 'multiselect', options: [
        { value: 'educativo', label: 'Educativo' },
        { value: 'inspirador', label: 'Inspirador' },
        { value: 'provocador', label: 'Provocador' },
        { value: 'tecnico', label: 'Técnico' },
        { value: 'humor', label: 'Humor' },
        { value: 'sofisticado', label: 'Sofisticado' },
        { value: 'popular', label: 'Popular' },
        { value: 'polemico', label: 'Polêmico' },
        { value: 'espiritual', label: 'Espiritual' },
      ]},
      { id: 'palavrasUsaMuito', question: 'Cite 5 palavras que a marca usa muito', type: 'text', placeholder: 'Palavras-chave da marca' },
      { id: 'palavrasEvita', question: 'Cite 5 palavras/temas que a marca evita', type: 'text', placeholder: 'O que nunca usar' },
      { id: 'temasProibidos', question: 'Temas proibidos ou sensíveis (nunca falar / falar com cuidado)', type: 'textarea', placeholder: 'Assuntos delicados' },
      { id: 'verdadeIncomoda', question: 'Qual "verdade incômoda/opinião forte" você defende no seu nicho?', type: 'textarea', placeholder: 'Seu posicionamento polêmico' },
      { id: 'comoRespondeCriticas', question: 'Como vocês preferem responder críticas/hate?', type: 'select', options: [
        { value: 'nao_responde', label: 'Não responde' },
        { value: 'curto_educado', label: 'Responde curto e educado' },
        { value: 'firmeza', label: 'Responde com firmeza' },
        { value: 'privado', label: 'Leva pro privado' },
      ]},
    ],
  },
  {
    title: 'Conteúdo',
    questions: [
      { id: 'objetivoRedes', question: 'Qual é seu objetivo principal nas redes nos próximos 90 dias?', type: 'multiselect', options: [
        { value: 'autoridade', label: 'Autoridade' },
        { value: 'leads', label: 'Leads' },
        { value: 'vendas', label: 'Vendas' },
        { value: 'comunidade', label: 'Comunidade' },
        { value: 'branding', label: 'Branding' },
      ]},
      { id: 'primeiraImpressao', question: 'Que primeira impressão você quer causar? (3 adjetivos)', type: 'text', placeholder: 'Ex: profissional, acolhedor, inovador' },
      { id: 'plataformasPrioritarias', question: 'Plataformas prioritárias (escolha até 2-3)', type: 'multiselect', options: [
        { value: 'instagram', label: 'Instagram' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'youtube_shorts', label: 'YouTube Shorts' },
        { value: 'threads', label: 'Threads' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'blog', label: 'Blog' },
        { value: 'email', label: 'E-mail' },
        { value: 'podcast', label: 'Podcast' },
      ]},
      { id: 'frequenciaDesejada', question: 'Frequência desejada (posts por semana)', type: 'select', options: [
        { value: '3', label: '3x por semana' },
        { value: '5', label: '5x por semana' },
        { value: '7', label: '7x por semana (diário)' },
        { value: 'outro', label: 'Outro' },
      ]},
      { id: 'formatosConsegueProduzir', question: 'Quais formatos você consegue produzir hoje?', type: 'multiselect', options: [
        { value: 'reels_falando', label: 'Reels falando' },
        { value: 'cortes', label: 'Cortes' },
        { value: 'entrevista', label: 'Entrevista' },
        { value: 'vlog', label: 'Vlog' },
        { value: 'bastidores', label: 'Bastidores' },
        { value: 'tutorial', label: 'Tutorial' },
        { value: 'carrossel', label: 'Carrossel' },
        { value: 'stories', label: 'Stories' },
        { value: 'live', label: 'Live' },
        { value: 'texto', label: 'Texto (LinkedIn)' },
      ]},
      { id: 'rostoConteudo', question: 'Quem será o rosto do conteúdo?', type: 'multiselect', options: [
        { value: 'fundador', label: 'Fundador(a)' },
        { value: 'time', label: 'Time' },
        { value: 'ugc', label: 'Clientes (UGC)' },
        { value: 'sem_rosto', label: 'Sem rosto (brand)' },
      ]},
      { id: 'quemGrava', question: 'Quem grava? Essa pessoa tem facilidade com câmera?', type: 'text', placeholder: 'Nome e se tem facilidade' },
      { id: 'temEditor', question: 'Você tem editor/design?', type: 'select', options: [
        { value: 'eu_mesmo', label: 'Eu mesmo(a)' },
        { value: 'editor', label: 'Editor' },
        { value: 'designer', label: 'Designer' },
        { value: 'equipe', label: 'Equipe completa' },
        { value: 'nao_tenho', label: 'Não tenho' },
      ]},
      { id: 'quadroSerie', question: 'Existe algum quadro/série que você quer manter?', type: 'select', options: [
        { value: 'sim', label: 'Sim' },
        { value: 'nao', label: 'Não' },
      ]},
      { id: 'qualQuadro', question: 'Qual quadro/série?', type: 'text', placeholder: 'Nome do quadro' },
      { id: 'ctasPermitidos', question: 'Quais CTAs são permitidos?', type: 'multiselect', options: [
        { value: 'comente', label: '"Comente [palavra]"' },
        { value: 'link', label: '"Clique no link"' },
        { value: 'whatsapp', label: '"Me chama no WhatsApp"' },
        { value: 'baixe', label: '"Baixe o material"' },
        { value: 'agende', label: '"Agende call"' },
        { value: 'lista', label: '"Entre na lista"' },
      ]},
      { id: 'temLeadMagnet', question: 'Você tem alguma isca/lead magnet?', type: 'select', options: [
        { value: 'sim', label: 'Sim' },
        { value: 'nao', label: 'Não' },
      ]},
      { id: 'linkLeadMagnet', question: 'Link + descrição do lead magnet', type: 'textarea', placeholder: 'Link e o que é a isca' },
      { id: 'temasPublicoAma', question: 'Lista rápida: 10 temas que o público ama e você quer bater', type: 'textarea', placeholder: 'Temas que funcionam bem' },
      { id: 'agenda90Dias', question: 'Agenda dos próximos 90 dias (lançamentos/eventos/campanhas)', type: 'textarea', placeholder: 'O que está planejado' },
    ],
  },
  {
    title: 'Concorrência',
    questions: [
      { id: 'concorrentesDiretos', question: 'Liste 3 concorrentes diretos (links)', type: 'textarea', placeholder: 'Links dos concorrentes' },
      { id: 'ondeConcorrentesMelhores', question: 'Em 1 linha cada: onde eles são melhores?', type: 'textarea', placeholder: 'Pontos fortes deles' },
      { id: 'porQueEscolhemVoce', question: 'Em 1 frase: por que o cliente escolhe você e não eles?', type: 'textarea', placeholder: 'Seu diferencial' },
      { id: 'referenciasConteudo', question: 'Liste 3 referências de conteúdo que você gosta (links)', type: 'textarea', placeholder: 'Contas que você admira' },
      { id: 'oQueQuerCopiar', question: 'O que exatamente você quer copiar dessas referências?', type: 'textarea', placeholder: 'Estilo, formato, tom...' },
      { id: 'referenciaNaoGosta', question: 'Liste 1 referência que você NÃO gosta (link) + por quê', type: 'textarea', placeholder: 'O que evitar' },
    ],
  },
  {
    title: 'Final',
    questions: [
      { id: 'algoMais', question: 'Tem algo que você quer que a IA saiba e não foi perguntado?', type: 'textarea', placeholder: 'Informações adicionais importantes' },
      { id: 'restricaoLegal', question: 'No seu nicho há alguma restrição legal de conteúdo? (Ex: OAB, medicina, etc)', type: 'textarea', placeholder: 'Restrições que devemos respeitar' },
    ],
  },
];

const initialFormData: FormData = {
  razaoSocial: '',
  nomeFantasia: '',
  cnpj: '',
  dataFundacao: '',
  siteInstitucional: '',
  estadosCidades: '',
  paisesInternacionais: '',
  temSedeFixa: '',
  enderecoSede: '',
  segmentoEspecifico: '',
  faturamentoAnual: '',
  instagram: '',
  tiktok: '',
  youtubeShorts: '',
  threads: '',
  reclameAqui: '',
  googleMeuNegocio: '',
  outrosCanais: '',
  oQueFaz: '',
  paraQuem: '',
  comoComecou: '',
  missao: '',
  visao3a5Anos: '',
  valores: '',
  produtoPrioritario: '',
  precoProduto: '',
  formasPagamento: [],
  oQueIncluso: '',
  oQueNaoIncluso: '',
  transformacaoEntrega: '',
  temProvasSociais: '',
  linksProvasSociais: '',
  linkPaginaProduto: '',
  tipoCliente: '',
  clienteIdeal: '',
  tresDores: '',
  tresDesejos: '',
  tresObjecoes: '',
  frasesCliente: '',
  ondeClienteVive: [],
  pesquisasGoogle: '',
  comoClienteChega: [],
  proximoPasso: [],
  capacidadeEntrega: '',
  maioresGargalos: [],
  faqPerguntas: '',
  porQueNaoFecham: '',
  sabeNumeros: '',
  ticketMedio: '',
  cac: '',
  taxaConversao: '',
  tomMarca: [],
  palavrasUsaMuito: '',
  palavrasEvita: '',
  temasProibidos: '',
  verdadeIncomoda: '',
  comoRespondeCriticas: '',
  objetivoRedes: [],
  primeiraImpressao: '',
  plataformasPrioritarias: [],
  frequenciaDesejada: '',
  formatosConsegueProduzir: [],
  rostoConteudo: [],
  quemGrava: '',
  temEditor: '',
  quadroSerie: '',
  qualQuadro: '',
  ctasPermitidos: [],
  temLeadMagnet: '',
  linkLeadMagnet: '',
  temasPublicoAma: '',
  agenda90Dias: '',
  concorrentesDiretos: '',
  ondeConcorrentesMelhores: '',
  porQueEscolhemVoce: '',
  referenciasConteudo: '',
  oQueQuerCopiar: '',
  referenciaNaoGosta: '',
  algoMais: '',
  restricaoLegal: '',
};

// Preparar sections para o layout
const layoutSections = sections.map(s => ({
  title: s.title,
  questionCount: s.questions.length,
}));

const totalQuestions = sections.reduce((acc, s) => acc + s.questions.length, 0);

export default function EssentialBriefingPage() {
  const router = useRouter();
  const { userId } = useAuth();
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [maxProgressReached, setMaxProgressReached] = useState(0); // Progresso máximo alcançado

  // Hook de onboarding
  const {
    loading: onboardingLoading,
    saving,
    error: onboardingError,
    formData: savedFormData,
    progress: savedProgress,
    loadAll,
    saveSection,
    complete,
  } = useOnboarding({ type: 'essential', autoSave: true });

  // Carregar dados salvos ao montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('onboarding_draft_essential');
      localStorage.removeItem('onboarding_draft_complete');
    }
    loadAll();
  }, [loadAll]);

  // Restaurar estado quando dados forem carregados
  useEffect(() => {
    if (savedFormData && Object.keys(savedFormData).length > 0 && !isInitialized) {
      setFormData(prev => ({
        ...prev,
        ...savedFormData as Partial<FormData>,
      }));

      if (savedProgress) {
        setCurrentSection(savedProgress.current_section);
        setCurrentQuestion(savedProgress.current_question);
        // Restaurar progresso máximo baseado na posição salva
        const savedGlobalIdx = sections.slice(0, savedProgress.current_section).reduce((acc, s) => acc + s.questions.length, 0) + savedProgress.current_question;
        setMaxProgressReached(savedGlobalIdx);
      }

      setIsInitialized(true);
    }
  }, [savedFormData, savedProgress, isInitialized]);

  const section = sections[currentSection];
  const question = section.questions[currentQuestion];

  // Obter dados da seção atual para salvar
  const getSectionData = useCallback(() => {
    const section = sections[currentSection];
    const sectionData: Record<string, unknown> = {};

    for (const q of section.questions) {
      sectionData[q.id] = formData[q.id as keyof FormData];
    }

    return sectionData;
  }, [currentSection, formData]);

  const handleNext = async () => {
    const sectionData = getSectionData();
    await saveSection(currentSection, sectionData, currentQuestion);

    if (currentQuestion < section.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
    } else {
      const success = await complete();
      if (success) {
        router.push('/dashboard');
      }
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setCurrentQuestion(sections[currentSection - 1].questions.length - 1);
    } else {
      router.push('/onboarding');
    }
  };

  const handleInputChange = (value: string | string[]) => {
    setFormData({
      ...formData,
      [question.id]: value,
    });
  };

  // Voice input hook
  const handleVoiceResult = useCallback((text: string) => {
    const currentVal = formData[question.id as keyof FormData] as string || '';
    handleInputChange(currentVal + (currentVal ? ' ' : '') + text);
  }, [question.id, formData]);

  const { isListening, isSupported, toggleListening, stopListening } = useVoiceInput({
    onResult: handleVoiceResult,
  });

  // Cores do tema por seção
  const sectionColors = [
    '#3B82F6', // 0 - Dados Básicos - Azul
    '#EC4899', // 1 - Redes Sociais - Rosa
    '#8B5CF6', // 2 - Identidade - Roxo
    '#F59E0B', // 3 - Oferta Principal - Âmbar
    '#10B981', // 4 - Cliente Ideal - Verde
    '#EF4444', // 5 - Funil de Vendas - Vermelho
    '#06B6D4', // 6 - Comunicação - Ciano
    '#F97316', // 7 - Conteúdo - Laranja
    '#64748B', // 8 - Concorrência - Slate
    '#D4AF37', // 9 - Final - Dourado
  ];
  const themeColor = sectionColors[currentSection] || '#3B82F6';

  const renderInput = () => {
    const value = formData[question.id as keyof FormData];
    const showMic = isSupported && (question.type === 'text' || question.type === 'textarea' || question.type === 'url');

    switch (question.type) {
      case 'text':
      case 'url':
        const textValue = value as string || '';
        const hasTextValue = textValue.length > 0;
        return (
          <div className="relative group">
            {/* Glow effect container */}
            <div
              className={`absolute -inset-1 rounded-3xl transition-all duration-500 ${hasTextValue ? 'opacity-100' : 'opacity-0 group-focus-within:opacity-50'}`}
              style={{
                background: `linear-gradient(135deg, ${themeColor}30, ${themeColor}10)`,
                filter: 'blur(8px)',
              }}
            />

            <div className="relative">
              <input
                type={question.type === 'url' ? 'url' : 'text'}
                value={textValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={question.placeholder}
                className="w-full px-5 py-4 pr-14 rounded-2xl border-2 focus:ring-0 outline-none text-slate-800 text-base transition-all bg-white/90 backdrop-blur-sm shadow-sm focus:shadow-lg"
                style={{
                  borderColor: hasTextValue ? themeColor : '#e2e8f0',
                }}
                autoFocus
              />

              {/* Character indicator */}
              {hasTextValue && (
                <div
                  className="absolute left-4 -bottom-6 text-xs font-medium transition-all"
                  style={{ color: themeColor }}
                >
                  ✓ Preenchido
                </div>
              )}

              {showMic && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all ${
                    isListening
                      ? 'text-white animate-pulse shadow-lg'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: isListening ? themeColor : undefined,
                  }}
                  title={isListening ? 'Parar gravação' : 'Falar resposta'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>
        );

      case 'date':
        const dateValue = value as string || '';
        return (
          <div className="relative group">
            <div
              className={`absolute -inset-1 rounded-3xl transition-all duration-500 ${dateValue ? 'opacity-100' : 'opacity-0 group-focus-within:opacity-50'}`}
              style={{
                background: `linear-gradient(135deg, ${themeColor}30, ${themeColor}10)`,
                filter: 'blur(8px)',
              }}
            />
            <input
              type="date"
              value={dateValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className="relative w-full px-5 py-4 rounded-2xl border-2 focus:ring-0 outline-none text-slate-800 text-base transition-all bg-white/90 backdrop-blur-sm shadow-sm focus:shadow-lg"
              style={{ borderColor: dateValue ? themeColor : '#e2e8f0' }}
              autoFocus
            />
          </div>
        );

      case 'textarea':
        const textareaValue = value as string || '';
        const hasTextareaValue = textareaValue.length > 0;
        const charCount = textareaValue.length;
        return (
          <div className="relative group">
            {/* Glow effect */}
            <div
              className={`absolute -inset-1 rounded-3xl transition-all duration-500 ${hasTextareaValue ? 'opacity-100' : 'opacity-0 group-focus-within:opacity-50'}`}
              style={{
                background: `linear-gradient(135deg, ${themeColor}30, ${themeColor}10)`,
                filter: 'blur(8px)',
              }}
            />

            <div className="relative">
              <textarea
                value={textareaValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={question.placeholder}
                rows={4}
                className="w-full px-5 py-4 pr-14 rounded-2xl border-2 focus:ring-0 outline-none text-slate-800 text-base transition-all resize-none bg-white/90 backdrop-blur-sm shadow-sm focus:shadow-lg"
                style={{ borderColor: hasTextareaValue ? themeColor : '#e2e8f0' }}
                autoFocus
              />

              {/* Character count and status */}
              <div className="absolute left-4 -bottom-6 flex items-center gap-3">
                {hasTextareaValue && (
                  <>
                    <span
                      className="text-xs font-medium"
                      style={{ color: themeColor }}
                    >
                      ✓ {charCount} caracteres
                    </span>
                  </>
                )}
              </div>

              {showMic && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute right-3 top-3 p-2.5 rounded-xl transition-all ${
                    isListening
                      ? 'text-white animate-pulse shadow-lg'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: isListening ? themeColor : undefined,
                  }}
                  title={isListening ? 'Parar gravação' : 'Falar resposta'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            {question.options?.map((option, idx) => {
              const isSelected = value === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleInputChange(option.value)}
                  className={`w-full px-5 py-4 rounded-2xl text-left transition-all duration-300 relative overflow-hidden group ${
                    isSelected
                      ? 'text-white shadow-lg'
                      : 'bg-white/80 backdrop-blur-sm border-2 border-slate-200 hover:border-slate-300 text-slate-700 hover:shadow-md'
                  }`}
                  style={{
                    backgroundColor: isSelected ? themeColor : undefined,
                    boxShadow: isSelected ? `0 10px 30px -10px ${themeColor}80` : undefined,
                  }}
                >
                  {/* Glow effect on hover */}
                  {!isSelected && (
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{ backgroundColor: themeColor }}
                    />
                  )}
                  <span className="relative flex items-center gap-3">
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'border-white bg-white/20' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </span>
                    <span className="font-medium">{option.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        );

      case 'multiselect':
        const selectedValues = (value as string[]) || [];
        return (
          <div className="flex flex-wrap gap-2 justify-center">
            {question.options?.map((option) => {
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
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    isSelected
                      ? 'text-white shadow-md'
                      : 'bg-white/80 backdrop-blur-sm border-2 border-slate-200 hover:border-slate-300 text-slate-600 hover:shadow-sm'
                  }`}
                  style={{
                    backgroundColor: isSelected ? themeColor : undefined,
                    boxShadow: isSelected ? `0 4px 15px -3px ${themeColor}60` : undefined,
                  }}
                >
                  <span className="flex items-center gap-2">
                    {isSelected && <Check className="w-3.5 h-3.5" />}
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

  const isLastQuestion = currentSection === sections.length - 1 && currentQuestion === section.questions.length - 1;

  // Valor atual para detectar digitação
  const currentValue = formData[question.id as keyof FormData];
  const currentValueString = Array.isArray(currentValue) ? currentValue.join(' ') : (currentValue || '');

  // Calcular índice global da pergunta atual
  const completedQuestions = sections.slice(0, currentSection).reduce((acc, s) => acc + s.questions.length, 0) + currentQuestion;

  // Atualizar progresso máximo quando avançar
  useEffect(() => {
    if (completedQuestions > maxProgressReached) {
      setMaxProgressReached(completedQuestions);
    }
  }, [completedQuestions, maxProgressReached]);

  // Calcular perguntas puladas usando o progresso MÁXIMO (não o atual)
  // Assim quando voltar, as perguntas puladas continuam aparecendo
  const skippedQuestions: number[] = [];
  let globalIdx = 0;
  for (let secIdx = 0; secIdx < sections.length; secIdx++) {
    for (let qIdx = 0; qIdx < sections[secIdx].questions.length; qIdx++) {
      const q = sections[secIdx].questions[qIdx];
      const value = formData[q.id as keyof FormData];
      const isEmpty = !value || (Array.isArray(value) ? value.length === 0 : String(value).trim().length === 0);

      // Usa maxProgressReached para manter os pontos vermelhos mesmo quando volta
      if (globalIdx < maxProgressReached && isEmpty) {
        skippedQuestions.push(globalIdx);
      }
      globalIdx++;
    }
  }

  // Callback para navegar para uma pergunta específica (quando clica no ponto vermelho)
  const handleNavigateToQuestion = useCallback((sectionIdx: number, questionIdx: number) => {
    setCurrentSection(sectionIdx);
    setCurrentQuestion(questionIdx);
  }, []);

  return (
    <>
      <OnboardingLayout
        type="essential"
        currentSection={currentSection}
        currentQuestion={currentQuestion}
        totalSections={sections.length}
        totalQuestions={totalQuestions}
        sectionTitle={section.title}
        questionText={question.question}
        onNext={handleNext}
        onBack={handleBack}
        saving={saving}
        loading={onboardingLoading && !isInitialized}
        error={onboardingError}
        isLastQuestion={isLastQuestion}
        isRecording={isListening}
        onStopRecording={stopListening}
        sections={layoutSections}
        currentValue={currentValueString}
        skippedQuestions={skippedQuestions}
        maxProgress={maxProgressReached}
        onNavigateToQuestion={handleNavigateToQuestion}
      >
        {/* Input com botão de comentários */}
        <div className="relative">
          {/* Botão de comentários - fixo no canto superior direito da área */}
          {userId && (
            <div className="flex justify-end mb-2">
              <FieldComments
                key={`comments-${question.id}`}
                fieldName={question.id}
                briefingUserId={userId}
                onboardingType="essential"
              />
            </div>
          )}

          {renderInput()}
        </div>
      </OnboardingLayout>

      {/* Botão flutuante para preview - discreto */}
      <button
        onClick={() => setShowPreview(true)}
        className="fixed bottom-4 right-4 p-2.5 bg-white/80 hover:bg-white text-slate-600 hover:text-amber-600 rounded-full shadow-sm hover:shadow-md transition-all z-40 backdrop-blur-sm border border-slate-200/50"
        title="Ver preview do briefing"
      >
        <Glasses className="w-4 h-4" />
      </button>

      {/* Modal de preview */}
      <BriefingPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        formData={formData}
        onboardingType="essential"
        sections={sections}
      />
    </>
  );
}
