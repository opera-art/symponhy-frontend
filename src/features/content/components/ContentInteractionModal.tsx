'use client';

import React, { useState } from 'react';
import { Card, Badge, Button, Input, Modal, ModalFooter } from '@/shared/components/ui';
import { cn } from '@/lib/utils';
import { FloatingOracle } from '@/features/chat/components';
import {
  X,
  CheckCircle,
  XCircle,
  Edit3,
  Send,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface ContentInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    id: string;
    title: string;
    thumbnail: string;
    type: string;
    status?: string;
  };
  onApprove: () => void;
  onDeny: (reason: string) => void;
  onEdit: () => void;
}

export const ContentInteractionModal: React.FC<ContentInteractionModalProps> = ({
  isOpen,
  onClose,
  content,
  onApprove,
  onDeny,
  onEdit,
}) => {
  const [activeAction, setActiveAction] = useState<'none' | 'approve' | 'deny' | 'edit'>('none');
  const [denyReason, setDenyReason] = useState('');
  const [chatMessages, setChatMessages] = useState<{ type: 'user' | 'ai'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [orbState, setOrbState] = useState<'idle' | 'approved' | 'denied' | 'dissolving'>('idle');

  const denyReasons = [
    'Hook fraco',
    'Copy confusa',
    'Criativo ruim',
    'Fora da estratégia',
    'Qualidade baixa',
  ];

  const handleApprove = () => {
    setOrbState('approved');
    setChatMessages([
      ...chatMessages,
      { type: 'ai', text: '✨ Conteúdo aprovado com sucesso! Será publicado conforme agendamento.' },
    ]);
    setTimeout(() => {
      onApprove();
      setOrbState('dissolving');
      setTimeout(onClose, 600);
    }, 1500);
  };

  const handleDeny = () => {
    if (denyReason.trim()) {
      setOrbState('denied');
      setChatMessages([
        ...chatMessages,
        {
          type: 'ai',
          text: `📝 Feedback registrado: "${denyReason}". Você pode editar o conteúdo e reenviar para análise.`,
        },
      ]);
      setTimeout(() => {
        onDeny(denyReason);
        setDenyReason('');
        setActiveAction('none');
      }, 1500);
    }
  };

  const handleSendChat = () => {
    if (chatInput.trim()) {
      const newMessages: { type: 'user' | 'ai'; text: string }[] = [
        ...chatMessages,
        { type: 'user', text: chatInput },
      ];
      setChatMessages(newMessages);
      setChatInput('');

      // Simulate AI response
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            type: 'ai',
            text: '🤖 Entendi sua solicitação. Como posso ajudar com este conteúdo?',
          },
        ]);
      }, 800);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background blur overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card
        padding="lg"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white flex flex-col animate-fade-in"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors z-10"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6 pr-10">
          <img
            src={content.thumbnail}
            alt={content.title}
            className="w-24 h-24 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-900 mb-1">
              {content.title}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="default" size="sm">
                {content.type}
              </Badge>
              {content.status && (
                <Badge
                  variant={content.status === 'approved' ? 'success' : 'warning'}
                  size="sm"
                >
                  {content.status === 'approved' ? 'Aprovado' : 'Pendente'}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Main content - Split layout */}
        <div className="flex-1 overflow-hidden flex gap-6 mb-4">
          {/* Left: Orb and Actions */}
          <div className="flex flex-col items-center gap-4">
            <FloatingOracle size={160} />

            {/* Action buttons */}
            {activeAction === 'none' && (
              <div className="flex flex-col gap-3 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Edit3 className="w-4 h-4" />}
                  onClick={() => {
                    onEdit();
                    onClose();
                  }}
                  className="text-slate-600"
                >
                  Editar
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                  onClick={handleApprove}
                >
                  Aprovar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<XCircle className="w-4 h-4" />}
                  onClick={() => setActiveAction('deny')}
                >
                  Negar
                </Button>
              </div>
            )}

            {/* Deny form */}
            {activeAction === 'deny' && (
              <div className="flex flex-col gap-3 w-full">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-600 uppercase">Motivo</p>
                  <div className="flex flex-col gap-1">
                    {denyReasons.map((reason) => (
                      <button
                        key={reason}
                        onClick={() => setDenyReason(reason)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                          denyReason === reason
                            ? 'bg-gold text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        )}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                  <Input
                    placeholder="Ou descreva..."
                    value={denyReason}
                    onChange={(e) => setDenyReason(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setActiveAction('none');
                      setDenyReason('');
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDeny}
                    disabled={!denyReason.trim()}
                  >
                    Confirmar
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Chat */}
          <div className="flex-1 flex flex-col bg-slate-50 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <p className="text-sm font-medium text-slate-900">Análise Inteligente</p>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto space-y-3 p-4">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500">
                    Clique nas ações acima para interagir com o conteúdo
                  </p>
                </div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'flex gap-2 animate-fade-in',
                      msg.type === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-xs px-3 py-2 rounded-lg text-sm',
                        msg.type === 'user'
                          ? 'bg-gold text-white rounded-br-none'
                          : 'bg-white text-slate-900 rounded-bl-none border border-slate-200'
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat input */}
            <div className="border-t border-slate-200 p-3 bg-white">
              <div className="flex gap-2">
                <Input
                  placeholder="Dúvidas sobre o conteúdo?"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendChat();
                    }
                  }}
                  className="text-sm"
                />
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Send className="w-4 h-4" />}
                  onClick={handleSendChat}
                  disabled={!chatInput.trim()}
                >
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
