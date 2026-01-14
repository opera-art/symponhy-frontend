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

      {/* Content Selection Modal - Luxurious Design */}
      {isAddingContent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleCloseContentModal}
        >
          {/* Backdrop with gradient */}
          <div
            className={`absolute inset-0 transition-all duration-500 ${showModal ? 'opacity-100' : 'opacity-0'}`}
            style={{
              background: 'radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)',
              backdropFilter: 'blur(12px)',
            }}
          />

          {/* Modal */}
          {showModal && (
            <div
              className="relative z-50 w-[420px] overflow-hidden animate-modal-in"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                borderRadius: '32px',
                boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
              }}
            >
              {/* Shimmer border effect */}
              <div className="absolute inset-0 rounded-[32px] p-[1px] shimmer-border pointer-events-none" />

              {/* Inner content */}
              <div className="relative p-10 flex flex-col items-center text-center">
                {/* Close button - top right */}
                <button
                  onClick={handleCloseContentModal}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all duration-200 hover:scale-110"
                  aria-label="Fechar"
                >
                  <X size={16} className="text-slate-500" />
                </button>

                {/* Sphere container with glow */}
                <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
                  {/* Glow effect */}
                  <div
                    className="absolute inset-0 rounded-full opacity-60"
                    style={{
                      background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)',
                      filter: 'blur(20px)',
                    }}
                  />
                  <FloatingOracle size={140} />
                </div>

                {/* Title with gradient */}
                <h2
                  className="text-2xl font-bold mb-3"
                  style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Criar novo conteúdo
                </h2>
                <p className="text-slate-500 text-sm mb-8 max-w-[280px]">
                  Escolha como deseja adicionar seu conteúdo ao calendário
                </p>

                {/* Options */}
                <div className="space-y-4 w-full">
                  {/* Manual Upload Option */}
                  <button
                    onClick={handleManualUploadClick}
                    className="w-full flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300 group"
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                      }}
                    >
                      <Upload className="w-6 h-6 text-sky-600" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-slate-800">Upload Manual</p>
                      <p className="text-sm text-slate-500 mt-0.5">Envie seus arquivos prontos</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all duration-300" />
                  </button>

                  {/* Create with Agents Option - Premium highlight */}
                  <button
                    onClick={handleCreateWithAgentsClick}
                    className="w-full flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 group relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                      boxShadow: '0 10px 40px -10px rgba(26, 26, 46, 0.5)',
                    }}
                  >
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: 'linear-gradient(45deg, transparent 30%, rgba(212, 175, 55, 0.1) 50%, transparent 70%)',
                      }}
                    />
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)',
                      }}
                    >
                      <Wand2 className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">Criar com Agentes</p>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-400/20 text-amber-400">
                          AI
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mt-0.5">Use IA para estratégias inteligentes</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all duration-300" />
                  </button>
                </div>

                {/* Footer hint */}
                <p className="mt-6 text-xs text-slate-400">
                  Pressione <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">ESC</kbd> para fechar
                </p>
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
