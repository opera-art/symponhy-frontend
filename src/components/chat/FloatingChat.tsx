'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { MiniOracle } from './MiniOracle';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const FloatingChat: React.FC = () => {
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
      {/* Floating Button with Mini Sphere */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl
          transition-all duration-500 ease-out overflow-hidden
          hover:scale-110 hover:shadow-blue-500/25
          ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Abrir chat"
      >
        <MiniOracle size={64} />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[380px] h-[520px]
          bg-white rounded-2xl shadow-2xl overflow-hidden
          flex flex-col transition-all duration-500 ease-out origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header with Mini Sphere */}
        <div className="relative h-20 bg-gradient-to-r from-slate-900 to-slate-800 flex items-center px-4">
          {/* Mini Sphere in Header */}
          <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
            <MiniOracle size={48} />
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
