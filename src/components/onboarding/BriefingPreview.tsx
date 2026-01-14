'use client';

import React, { useState, useEffect } from 'react';
import { X, Eye, Download, Copy, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

interface Section {
  title: string;
  fields: { label: string; value: string | string[] }[];
}

interface BriefingPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  formData: Record<string, any>;
  onboardingType: 'essential' | 'complete';
  sections: { title: string; questions: { id: string; question: string }[] }[];
}

// Labels amigáveis para campos
const fieldLabels: Record<string, string> = {
  razaoSocial: 'Razão Social',
  nomeFantasia: 'Nome Fantasia',
  cnpj: 'CNPJ',
  dataFundacao: 'Data de Fundação',
  siteInstitucional: 'Site',
  estadosCidades: 'Estados/Cidades',
  paisesInternacionais: 'Países',
  temSedeFixa: 'Tem Sede Física',
  enderecoSede: 'Endereço',
  segmentoEspecifico: 'Segmento',
  faturamentoAnual: 'Faturamento Anual',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtubeShorts: 'YouTube Shorts',
  threads: 'Threads',
  reclameAqui: 'Reclame Aqui',
  googleMeuNegocio: 'Google Meu Negócio',
  outrosCanais: 'Outros Canais',
  oQueFaz: 'O que faz',
  paraQuem: 'Para quem',
  comoComecou: 'Como começou',
  missao: 'Missão',
  visao3a5Anos: 'Visão 3-5 anos',
  valores: 'Valores',
  produtoPrioritario: 'Produto Prioritário',
  precoProduto: 'Preço',
  formasPagamento: 'Formas de Pagamento',
  oQueIncluso: 'O que está incluso',
  oQueNaoIncluso: 'O que não está incluso',
  transformacaoEntrega: 'Transformação/Resultado',
  temProvasSociais: 'Tem provas sociais',
  linksProvasSociais: 'Links provas sociais',
  linkPaginaProduto: 'Link página/WhatsApp',
  tipoCliente: 'Tipo de Cliente',
  clienteIdeal: 'Cliente Ideal',
  tresDores: 'Principais Dores',
  tresDesejos: 'Principais Desejos',
  tresObjecoes: 'Principais Objeções',
  frasesCliente: 'Frases do Cliente',
  ondeClienteVive: 'Onde o cliente está',
  pesquisasGoogle: 'Pesquisas Google',
  comoClienteChega: 'Como cliente chega',
  proximoPasso: 'Próximo passo',
  capacidadeEntrega: 'Capacidade de entrega',
  maioresGargalos: 'Maiores gargalos',
  faqPerguntas: 'FAQ',
  porQueNaoFecham: 'Por que não fecham',
  sabeNumeros: 'Sabe os números',
  ticketMedio: 'Ticket Médio',
  cac: 'CAC',
  taxaConversao: 'Taxa de Conversão',
  tomMarca: 'Tom da Marca',
  palavrasUsaMuito: 'Palavras que usa',
  palavrasEvita: 'Palavras que evita',
  temasProibidos: 'Temas proibidos',
  verdadeIncomoda: 'Opinião forte',
  comoRespondeCriticas: 'Como responde críticas',
  objetivoRedes: 'Objetivo nas redes',
  primeiraImpressao: 'Primeira impressão',
  plataformasPrioritarias: 'Plataformas prioritárias',
  frequenciaDesejada: 'Frequência de posts',
  formatosConsegueProduzir: 'Formatos que produz',
  rostoConteudo: 'Rosto do conteúdo',
  quemGrava: 'Quem grava',
  temEditor: 'Tem editor',
  quadroSerie: 'Tem quadro/série',
  qualQuadro: 'Qual quadro',
  ctasPermitidos: 'CTAs permitidos',
  temLeadMagnet: 'Tem lead magnet',
  linkLeadMagnet: 'Link lead magnet',
  temasPublicoAma: 'Temas que o público ama',
  agenda90Dias: 'Agenda 90 dias',
  concorrentesDiretos: 'Concorrentes diretos',
  ondeConcorrentesMelhores: 'Onde concorrentes são melhores',
  porQueEscolhemVoce: 'Por que escolhem você',
  referenciasConteudo: 'Referências de conteúdo',
  oQueQuerCopiar: 'O que quer copiar',
  referenciaNaoGosta: 'Referência que não gosta',
  algoMais: 'Algo mais',
  restricaoLegal: 'Restrição legal',
};

export const BriefingPreview: React.FC<BriefingPreviewProps> = ({
  isOpen,
  onClose,
  formData,
  onboardingType,
  sections,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const formatValue = (value: any): string => {
    if (!value) return '—';
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : '—';
    }
    return String(value);
  };

  const getFilledCount = (sectionQuestions: { id: string }[]): number => {
    return sectionQuestions.filter(q => {
      const value = formData[q.id];
      if (!value) return false;
      if (Array.isArray(value)) return value.length > 0;
      return String(value).trim().length > 0;
    }).length;
  };

  // Gerar texto para copiar
  const generateText = (): string => {
    let text = `BRIEFING ${onboardingType.toUpperCase()}\n`;
    text += `${'='.repeat(50)}\n\n`;

    sections.forEach(section => {
      text += `## ${section.title}\n`;
      text += `${'-'.repeat(30)}\n`;

      section.questions.forEach(q => {
        const label = fieldLabels[q.id] || q.question;
        const value = formatValue(formData[q.id]);
        if (value !== '—') {
          text += `${label}: ${value}\n`;
        }
      });

      text += '\n';
    });

    return text;
  };

  const handleCopy = async () => {
    const text = generateText();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = generateText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `briefing-${onboardingType}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Preview do Briefing</h2>
              <p className="text-xs text-slate-500">
                {onboardingType === 'essential' ? 'Essential' : 'Complete'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Baixar
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {sections.map((section, sectionIndex) => {
              const filledCount = getFilledCount(section.questions);
              const totalCount = section.questions.length;
              const isExpanded = expandedSections.has(sectionIndex);

              return (
                <div
                  key={sectionIndex}
                  className="border border-slate-200 rounded-xl overflow-hidden"
                >
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(sectionIndex)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="font-medium text-slate-700">{section.title}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      filledCount === totalCount
                        ? 'bg-green-100 text-green-700'
                        : filledCount > 0
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {filledCount}/{totalCount}
                    </span>
                  </button>

                  {/* Section Content */}
                  {isExpanded && (
                    <div className="px-4 py-3 space-y-3">
                      {section.questions.map(question => {
                        const value = formData[question.id];
                        const displayValue = formatValue(value);
                        const isEmpty = displayValue === '—';

                        return (
                          <div key={question.id} className={`${isEmpty ? 'opacity-40' : ''}`}>
                            <p className="text-xs font-medium text-slate-500 mb-1">
                              {fieldLabels[question.id] || question.question}
                            </p>
                            <p className={`text-sm ${isEmpty ? 'text-slate-400 italic' : 'text-slate-800'}`}>
                              {displayValue}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <p className="text-xs text-slate-500 text-center">
            Este é um preview do seu briefing. Continue preenchendo para completar todas as seções.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BriefingPreview;
