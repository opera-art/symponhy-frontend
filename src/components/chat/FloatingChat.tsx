'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Upload, Zap } from 'lucide-react';
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
  const [animationProgress, setAnimationProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const animationRef = useRef<number | null>(null);

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

  // Handle content adding animation
  useEffect(() => {
    if (isAddingContent && animationProgress < 1) {
      const startTime = performance.now();
      const duration = 600; // 600ms animation

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setAnimationProgress(progress);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isAddingContent]);

  const handleManualUploadClick = () => {
    if (onManualUpload) {
      onManualUpload();
    }
    setIsAddingContent(false);
    setAnimationProgress(0);
  };

  const handleCreateWithAgentsClick = () => {
    if (onCreateWithAgents) {
      onCreateWithAgents();
    }
    setIsAddingContent(false);
    setAnimationProgress(0);
  };

  const handleCloseContentModal = () => {
    setIsAddingContent(false);
    setAnimationProgress(0);
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

  // Calculate animation values for sphere movement and size
  const sphereSize = isAddingContent ? 80 + (120 - 80) * animationProgress : 80;
  const sphereScale = isAddingContent ? 1 : (isOpen ? 0 : 1);
  const offsetX = isAddingContent ? -((window.innerWidth / 2 - 24 - (window.innerWidth - 60)) * animationProgress) : 0;
  const offsetY = isAddingContent ? -((window.innerHeight / 2 - 24 - (window.innerHeight - 60)) * animationProgress) : 0;

  return (
    <>
      {/* Floating Button with Oracle Sphere */}
      <button
        onClick={() => !isAddingContent && setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 rounded-full
          transition-all duration-500 ease-out
          hover:scale-110 cursor-pointer
          ${isAddingContent || isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        style={{
          background: 'transparent',
          border: 'none',
          width: `${sphereSize}px`,
          height: `${sphereSize}px`,
        }}
        aria-label="Abrir chat"
      >
        <FloatingOracle size={Math.round(sphereSize)} />
      </button>

      {/* Animated Moving Sphere for Content Mode */}
      {isAddingContent && (
        <div
          className="fixed z-50 rounded-full pointer-events-none flex items-center justify-center"
          style={{
            width: `${sphereSize}px`,
            height: `${sphereSize}px`,
            left: `calc(50% - ${sphereSize / 2}px + ${offsetX}px)`,
            top: `calc(50% - ${sphereSize / 2}px + ${offsetY}px)`,
            transition: 'none',
          }}
        >
          <FloatingOracle size={Math.round(sphereSize)} />
        </div>
      )}

      {/* Content Selection Modal */}
      {isAddingContent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleCloseContentModal}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
            style={{
              opacity: Math.min(animationProgress / 0.8, 1) * 0.2,
            }}
          />

          {/* Modal */}
          <div
            className="relative z-50 bg-white rounded-3xl shadow-2xl w-96 p-8 flex flex-col items-center text-center transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{
              opacity: animationProgress >= 0.9 ? 1 : 0,
              transform: `scale(${0.95 + 0.05 * Math.min((animationProgress - 0.8) / 0.2, 1)})`,
            }}
          >
            {/* Sphere at top */}
            <div className="w-32 h-32 mb-6 flex items-center justify-center">
              <FloatingOracle size={128} />
            </div>

            {/* Question */}
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Como deseja criar seu conteúdo?
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Escolha entre enviar manualmente ou usar nossos agentes de IA
            </p>

            {/* Options */}
            <div className="space-y-3 w-full">
              {/* Manual Upload Option */}
              <button
                onClick={handleManualUploadClick}
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-slate-900 text-sm">Upload Manual</p>
                  <p className="text-xs text-slate-500">Envie seus arquivos diretamente</p>
                </div>
              </button>

              {/* Create with Agents Option */}
              <button
                onClick={handleCreateWithAgentsClick}
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-slate-900 text-sm">Criar com Agentes</p>
                  <p className="text-xs text-slate-500">Use IA para gerar estratégia</p>
                </div>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={handleCloseContentModal}
              className="mt-6 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </div>
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
