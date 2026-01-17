'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Upload, Wand2, Calendar, Sparkles } from 'lucide-react';
import { MiniViolin } from '@/shared/components/ui';
import { useChatContent } from '@/context/ChatContentContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const FloatingChat: React.FC = () => {
  const {
    isAddingContent,
    setIsAddingContent,
    onManualUpload,
    onCreateWithAgents,
    isPlanningDay,
    setIsPlanningDay,
    planningDate,
    setPlanningDate
  } = useChatContent();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou o assistente Symponhy. Como posso ajudar você hoje?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPlanningModal, setShowPlanningModal] = useState(false);
  const [planningInput, setPlanningInput] = useState('');
  const [planningMessages, setPlanningMessages] = useState<Message[]>([]);
  const [isPlanningTyping, setIsPlanningTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const planningMessagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const planningInputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Trigger modal after sphere animation completes
  useEffect(() => {
    if (isAddingContent) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [isAddingContent]);

  // Trigger planning modal after sphere animation completes
  useEffect(() => {
    if (isPlanningDay && planningDate) {
      const timer = setTimeout(() => {
        setShowPlanningModal(true);
        // Initialize with welcome message for the day
        setPlanningMessages([{
          id: '1',
          role: 'assistant',
          content: `Olá! Vamos planejar o conteúdo para ${planningDate.weekDay}, ${planningDate.formattedDate}. O que você gostaria de criar para este dia?`,
          timestamp: new Date(),
        }]);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setShowPlanningModal(false);
      setPlanningMessages([]);
      setPlanningInput('');
    }
  }, [isPlanningDay, planningDate]);

  // Scroll planning messages
  useEffect(() => {
    planningMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [planningMessages]);

  // Focus planning input when modal shows
  useEffect(() => {
    if (showPlanningModal && planningInputRef.current) {
      planningInputRef.current.focus();
    }
  }, [showPlanningModal]);

  const handleManualUploadClick = () => {
    if (onManualUpload) {
      onManualUpload();
    }
    setShowModal(false);
    setIsAddingContent(false);
  };

  const handleCreateWithAgentsClick = () => {
    if (onCreateWithAgents) {
      onCreateWithAgents();
    }
    setShowModal(false);
    setIsAddingContent(false);
  };

  const handleCloseContentModal = () => {
    setShowModal(false);
    setIsAddingContent(false);
  };

  const handleClosePlanningModal = () => {
    setShowPlanningModal(false);
    setIsPlanningDay(false);
    setPlanningDate(null);
  };

  const handlePlanningKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePlanningMessageSend();
    }
  };

  const handlePlanningMessageSend = async () => {
    if (!planningInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: planningInput.trim(),
      timestamp: new Date(),
    };

    setPlanningMessages((prev) => [...prev, userMessage]);
    setPlanningInput('');
    setIsPlanningTyping(true);

    // Simulated AI response for planning
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getPlanningResponse(userMessage.content),
        timestamp: new Date(),
      };
      setPlanningMessages((prev) => [...prev, assistantMessage]);
      setIsPlanningTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const getPlanningResponse = (userInput: string): string => {
    const lower = userInput.toLowerCase();
    const dateInfo = planningDate ? `${planningDate.weekDay}, ${planningDate.formattedDate}` : 'este dia';

    if (lower.includes('instagram') || lower.includes('insta')) {
      return `Ótima escolha! Para ${dateInfo}, posso sugerir um post de carrossel no Instagram. Qual seria o tema principal do conteúdo?`;
    }
    if (lower.includes('vídeo') || lower.includes('video') || lower.includes('reels')) {
      return `Perfeito! Vídeos têm ótimo engajamento. Para ${dateInfo}, qual formato você prefere: Reels curto (15-30s) ou vídeo mais longo?`;
    }
    if (lower.includes('story') || lower.includes('stories')) {
      return `Stories são ótimos para engajamento! Posso criar uma sequência de stories interativos para ${dateInfo}. Qual o objetivo: educar, vender ou entreter?`;
    }
    if (lower.includes('promoção') || lower.includes('promocao') || lower.includes('venda')) {
      return `Entendi! Para uma campanha de vendas em ${dateInfo}, sugiro criar urgência. Quer fazer um post único ou uma sequência de conteúdos?`;
    }

    return `Entendi! Vou ajudar você a planejar o conteúdo para ${dateInfo}. Pode me contar mais sobre o tipo de post (imagem, vídeo, carrossel) e o objetivo (engajamento, vendas, branding)?`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simular resposta do assistente (aqui você conecta com sua API/IA)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAssistantResponse(userMessage.content),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const getAssistantResponse = (userInput: string): string => {
    const lower = userInput.toLowerCase();

    if (lower.includes('agendar') || lower.includes('post')) {
      return 'Para agendar um post, vá até o Calendário e clique em "Novo Post". Você pode escolher a data, horário e as redes sociais onde deseja publicar.';
    }
    if (lower.includes('cliente') || lower.includes('clientes')) {
      return 'Na seção Clientes você pode gerenciar todos os seus clientes. Clique em "Adicionar Cliente" para cadastrar um novo.';
    }
    if (lower.includes('relatório') || lower.includes('métricas')) {
      return 'Os relatórios estão disponíveis na seção Analytics. Lá você encontra métricas de engajamento, alcance e crescimento.';
    }
    if (lower.includes('ajuda') || lower.includes('help')) {
      return 'Posso ajudar com: agendamento de posts, gestão de clientes, relatórios e métricas, configurações da conta. O que você precisa?';
    }

    return 'Entendi! Posso ajudar você com agendamento de posts, gestão de clientes, relatórios e muito mais. Me conte o que precisa fazer.';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes sphereToCenter {
          0% {
            bottom: 24px;
            right: 24px;
            width: 80px;
            height: 80px;
            opacity: 1;
          }
          100% {
            bottom: calc(50% - 70px);
            right: calc(50% - 70px);
            width: 140px;
            height: 140px;
            opacity: 1;
          }
        }
        @keyframes sphereFromCenter {
          0% {
            bottom: calc(50% - 70px);
            right: calc(50% - 70px);
            width: 140px;
            height: 140px;
            opacity: 1;
          }
          100% {
            bottom: 24px;
            right: 24px;
            width: 80px;
            height: 80px;
            opacity: 1;
          }
        }
        @keyframes modalFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-sphere-to-center {
          animation: sphereToCenter 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-modal-in {
          animation: modalFadeIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .shimmer-border {
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Floating Button with Violin */}
      <button
        onClick={() => !isAddingContent && setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-20 h-20
          transition-all duration-500 ease-out
          hover:scale-110 cursor-pointer
          ${isAddingContent || isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        style={{ background: 'transparent', border: 'none' }}
        aria-label="Abrir chat"
      >
        <MiniViolin size={80} />
      </button>

      {/* Animated Moving Violin for Content Mode - Hide when modal shows */}
      {(isAddingContent || isPlanningDay) && !showModal && !showPlanningModal && (
        <div
          className="fixed z-[60] pointer-events-none flex items-center justify-center animate-sphere-to-center"
          style={{
            bottom: '24px',
            right: '24px',
            width: '80px',
            height: '80px',
          }}
        >
          <MiniViolin size={120} />
        </div>
      )}

      {/* Content Selection Modal - Clean Chat Style */}
      {isAddingContent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleCloseContentModal}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${showModal ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Modal Container */}
          {showModal && (
            <div
              className="relative z-50 w-full max-w-md bg-white rounded-[28px] shadow-[0_2px_40px_-12px_rgba(0,0,0,0.15)] border border-gray-100 animate-modal-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-100/40 via-amber-50/20 to-transparent pointer-events-none rounded-tr-[28px]" />

              {/* Content */}
              <div className="relative p-8">
                {/* Hero Section */}
                <div className="flex flex-col items-center mb-8">
                  {/* Violin with subtle glow */}
                  <div className="relative w-24 h-24 mb-5 flex items-center justify-center">
                    <div className="absolute inset-0 bg-amber-200 blur-2xl opacity-30 rounded-full" />
                    <MiniViolin size={80} />
                  </div>

                  <h1 className="text-2xl font-medium tracking-tight text-slate-900 mb-2">
                    Adicionar conteúdo
                  </h1>
                  <p className="text-slate-500 text-center text-sm">
                    Escolha como deseja criar seu conteúdo
                  </p>
                </div>

                {/* Feature Cards */}
                <div className="space-y-3 mb-6">
                  {/* Upload Manual Card */}
                  <button
                    onClick={handleManualUploadClick}
                    className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-200 cursor-pointer group text-left flex items-start gap-4"
                  >
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-amber-50 transition-colors shrink-0">
                      <Upload className="w-5 h-5 text-slate-600 group-hover:text-amber-600" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-slate-800 mb-0.5">Upload Manual</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">Faça upload de imagens, vídeos ou arquivos prontos.</p>
                    </div>
                  </button>

                  {/* Create with Agents Card */}
                  <button
                    onClick={handleCreateWithAgentsClick}
                    className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-200 cursor-pointer group text-left flex items-start gap-4"
                  >
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-amber-50 transition-colors shrink-0">
                      <Wand2 className="w-5 h-5 text-slate-600 group-hover:text-amber-600" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-medium text-slate-800">Criar com Agentes</h3>
                        <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-amber-100 text-amber-700">AI</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">Use nossos agentes de IA para criar estratégias.</p>
                    </div>
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleCloseContentModal}
                  className="w-full py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Planning Day Chat Modal - EchoAI Style */}
      {isPlanningDay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleClosePlanningModal}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${showPlanningModal ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Modal Container - EchoAI Chat Style */}
          {showPlanningModal && (
            <div
              className="relative z-50 w-full max-w-2xl h-[600px] bg-white rounded-[28px] shadow-[0_2px_40px_-12px_rgba(0,0,0,0.15)] border border-gray-100 animate-modal-in flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-100/40 via-amber-50/20 to-transparent pointer-events-none rounded-tr-[28px]" />

              {/* Header */}
              <div className="relative px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 bg-amber-200 blur-xl opacity-30 rounded-full" />
                    <MiniViolin size={40} />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-slate-900">Planejar Conteúdo</h2>
                    {planningDate && (
                      <p className="text-sm text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {planningDate.weekDay}, {planningDate.formattedDate}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleClosePlanningModal}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {planningMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-slate-900 text-white rounded-br-md'
                          : 'bg-gray-50 text-slate-800 border border-gray-100 rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <span
                        className={`text-[10px] mt-1.5 block ${
                          message.role === 'user' ? 'text-slate-400' : 'text-slate-400'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}

                {isPlanningTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-50 px-4 py-3 rounded-2xl rounded-bl-md border border-gray-100">
                      <div className="flex space-x-1.5">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={planningMessagesEndRef} />
              </div>

              {/* Input Area - EchoAI Style */}
              <div className="p-4 border-t border-gray-100 shrink-0">
                <div className="bg-gray-50 rounded-2xl p-3">
                  <div className="flex items-start gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" strokeWidth={2} />
                    <textarea
                      ref={planningInputRef}
                      value={planningInput}
                      onChange={(e) => setPlanningInput(e.target.value)}
                      onKeyPress={handlePlanningKeyPress}
                      placeholder="Descreva o que você quer criar para este dia..."
                      className="w-full bg-transparent border-none outline-none resize-none text-slate-700 placeholder-slate-400 text-sm min-h-[40px] max-h-[100px]"
                      rows={1}
                    />
                  </div>

                  {/* Input Toolbar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-gray-100 rounded-full transition-colors">
                        <Upload className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      <button className="flex items-center gap-1.5 bg-white hover:bg-gray-100 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 transition-colors border border-gray-200">
                        <Wand2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                        Sugestões IA
                      </button>
                    </div>

                    <button
                      onClick={handlePlanningMessageSend}
                      disabled={!planningInput.trim()}
                      className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4 ml-0.5" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[380px] h-[520px]
          bg-white rounded-2xl shadow-2xl overflow-hidden
          flex flex-col transition-all duration-500 ease-out origin-bottom-right
          ${isOpen && !isAddingContent ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header with Violin */}
        <div className="relative h-20 bg-gradient-to-r from-amber-50 to-white border-b border-amber-100 flex items-center px-4">
          {/* Violin in Header */}
          <div className="w-14 h-14 mr-3 flex items-center justify-center">
            <MiniViolin size={48} />
          </div>

          <div className="flex-1">
            <h3 className="text-slate-900 font-semibold">Assistente Symponhy</h3>
            <p className="text-slate-500 text-sm">
              {isTyping ? 'Digitando...' : 'Online'}
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200
              flex items-center justify-center transition-colors"
            aria-label="Fechar chat"
          >
            <X size={18} className="text-slate-600" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-slate-900 text-white rounded-br-md'
                    : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-md'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <span
                  className={`text-[10px] mt-1 block ${
                    message.role === 'user' ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-slate-100">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-2.5 bg-slate-100 rounded-full text-sm
                focus:outline-none focus:ring-2 focus:ring-slate-900/20
                placeholder:text-slate-400"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-full bg-slate-900 text-white
                flex items-center justify-center
                hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed
                transition-colors"
              aria-label="Enviar mensagem"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
