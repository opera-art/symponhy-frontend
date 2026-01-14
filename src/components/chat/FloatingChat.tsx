'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Upload, Wand2, ArrowRight } from 'lucide-react';
import { FloatingOracle } from './FloatingOracle';
import { useChatContent } from '@/context/ChatContentContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const FloatingChat: React.FC = () => {
  const { isAddingContent, setIsAddingContent, onManualUpload, onCreateWithAgents } = useChatContent();
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

      {/* Floating Button with Oracle Sphere */}
      <button
        onClick={() => !isAddingContent && setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-20 h-20 rounded-full
          transition-all duration-500 ease-out
          hover:scale-110 cursor-pointer
          ${isAddingContent || isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        style={{ background: 'transparent', border: 'none' }}
        aria-label="Abrir chat"
      >
        <FloatingOracle size={80} />
      </button>

      {/* Animated Moving Sphere for Content Mode - Hide when modal shows */}
      {isAddingContent && !showModal && (
        <div
          className="fixed z-[60] rounded-full pointer-events-none flex items-center justify-center animate-sphere-to-center"
          style={{
            bottom: '24px',
            right: '24px',
            width: '80px',
            height: '80px',
          }}
        >
          <FloatingOracle size={140} />
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
                  {/* Sphere with subtle glow */}
                  <div className="relative w-20 h-20 mb-5 flex items-center justify-center">
                    <div className="absolute inset-0 bg-amber-200 blur-2xl opacity-30 rounded-full" />
                    <FloatingOracle size={80} />
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

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[380px] h-[520px]
          bg-white rounded-2xl shadow-2xl overflow-hidden
          flex flex-col transition-all duration-500 ease-out origin-bottom-right
          ${isOpen && !isAddingContent ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header with Oracle Sphere */}
        <div className="relative h-20 bg-gradient-to-r from-slate-900 to-slate-800 flex items-center px-4">
          {/* Oracle Sphere in Header */}
          <div className="w-12 h-12 mr-3">
            <FloatingOracle size={48} />
          </div>

          <div className="flex-1">
            <h3 className="text-white font-semibold">Assistente Symponhy</h3>
            <p className="text-slate-400 text-sm">
              {isTyping ? 'Digitando...' : 'Online'}
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20
              flex items-center justify-center transition-colors"
            aria-label="Fechar chat"
          >
            <X size={18} className="text-white" />
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
