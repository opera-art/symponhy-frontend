'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Check, Trash2, AtSign } from 'lucide-react';
import { useAuth, useOrganization } from '@clerk/nextjs';

interface Comment {
  id: string;
  clerk_user_id: string;
  author_clerk_user_id: string;
  author_name?: string;
  field_name: string;
  comment: string;
  resolved: boolean;
  created_at: string;
}

interface OrgMember {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
}

interface FieldCommentsProps {
  fieldName: string;
  briefingUserId: string;
  onboardingType: 'essential' | 'complete';
}

export const FieldComments: React.FC<FieldCommentsProps> = ({
  fieldName,
  briefingUserId,
  onboardingType,
}) => {
  const { userId } = useAuth();
  const { organization, memberships } = useOrganization({
    memberships: {
      infinite: true,
    },
  });

  const [comments, setComments] = useState<Comment[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // Estado para menções
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [mentionIndex, setMentionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Membros da organização
  const orgMembers: OrgMember[] = memberships?.data?.map(m => ({
    id: m.publicUserData?.userId || '',
    name: `${m.publicUserData?.firstName || ''} ${m.publicUserData?.lastName || ''}`.trim() || 'Usuário',
    email: m.publicUserData?.identifier || '',
    imageUrl: m.publicUserData?.imageUrl,
  })) || [];

  // Filtrar membros baseado na busca
  const filteredMembers = orgMembers.filter(m =>
    m.name.toLowerCase().includes(mentionSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  const API_BASE = '/api/proxy';

  const fetchComments = async () => {
    if (!briefingUserId) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/comments/${onboardingType}/${briefingUserId}/${fieldName}`
      );
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setComments([]);
    setIsOpen(false);
  }, [fieldName]);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, fieldName, briefingUserId]);

  // Detectar @ no input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewComment(value);

    // Verificar se o usuário digitou @
    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textAfterAt = value.slice(lastAtIndex + 1);
      // Se não tem espaço depois do @, mostrar sugestões
      if (!textAfterAt.includes(' ')) {
        setMentionSearch(textAfterAt);
        setShowMentions(true);
        setMentionIndex(0);
        return;
      }
    }
    setShowMentions(false);
  };

  // Inserir menção
  const insertMention = (member: OrgMember) => {
    const lastAtIndex = newComment.lastIndexOf('@');
    const textBefore = newComment.slice(0, lastAtIndex);
    const newValue = `${textBefore}@${member.name} `;
    setNewComment(newValue);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  // Navegação com teclado nas menções
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showMentions && filteredMembers.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMentionIndex(prev => (prev + 1) % filteredMembers.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMentionIndex(prev => (prev - 1 + filteredMembers.length) % filteredMembers.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertMention(filteredMembers[mentionIndex]);
        return;
      } else if (e.key === 'Escape') {
        setShowMentions(false);
      }
    } else if (e.key === 'Enter' && !e.shiftKey && newComment.trim()) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || sending) return;

    const commentText = newComment.trim();
    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      clerk_user_id: briefingUserId,
      author_clerk_user_id: userId || '',
      author_name: 'Você',
      field_name: fieldName,
      comment: commentText,
      resolved: false,
      created_at: new Date().toISOString(),
    };

    setComments(prev => [...prev, optimisticComment]);
    setNewComment('');
    setSending(true);

    try {
      const response = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkUserId: briefingUserId,
          onboardingType,
          fieldName,
          comment: commentText,
        }),
      });

      if (response.ok) {
        fetchComments();
        setTimeout(() => setIsOpen(false), 500);
      } else {
        setComments(prev => prev.filter(c => c.id !== optimisticComment.id));
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      setComments(prev => prev.filter(c => c.id !== optimisticComment.id));
    } finally {
      setSending(false);
    }
  };

  const handleResolve = async (commentId: string) => {
    try {
      await fetch(`${API_BASE}/comments/${onboardingType}/${commentId}/resolve`, {
        method: 'POST',
      });
      fetchComments();
    } catch (error) {
      console.error('Error resolving comment:', error);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await fetch(`${API_BASE}/comments/${onboardingType}/${commentId}`, {
        method: 'DELETE',
      });
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Renderizar texto do comentário com menções destacadas
  const renderCommentText = (text: string) => {
    const parts = text.split(/(@\w+(?:\s\w+)?)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return (
          <span key={i} className="text-amber-600 font-medium bg-amber-50 px-0.5 rounded">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const unresolvedCount = comments.filter(c => !c.resolved).length;

  return (
    <div className="relative p-1">
      {/* Botão de comentários */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-1.5 rounded-lg transition-all ${
          unresolvedCount > 0
            ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
            : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
        }`}
        title={`${comments.length} comentário(s)`}
      >
        <MessageCircle className="w-4 h-4" />
        {unresolvedCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-sm">
            {unresolvedCount}
          </span>
        )}
      </button>

      {/* Painel de comentários */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-medium text-slate-600">
              Comentários ({comments.length})
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-0.5 hover:bg-slate-200 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {/* Lista de comentários */}
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-3 text-center text-slate-400 text-xs">
                Carregando...
              </div>
            ) : comments.length === 0 ? (
              <div className="p-3 text-center text-slate-400 text-xs">
                Nenhum comentário
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-2.5 ${comment.resolved ? 'bg-slate-50 opacity-60' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs leading-relaxed ${comment.resolved ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                          {renderCommentText(comment.comment)}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-1">
                          {comment.author_name || 'Usuário'} • {new Date(comment.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </p>
                      </div>

                      {/* Ações */}
                      <div className="flex items-center">
                        {!comment.resolved && (
                          <button
                            onClick={() => handleResolve(comment.id)}
                            className="p-0.5 hover:bg-green-100 rounded text-slate-400 hover:text-green-600 transition-colors"
                            title="Resolver"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                        {comment.author_clerk_user_id === userId && (
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="p-0.5 hover:bg-red-100 rounded text-slate-400 hover:text-red-600 transition-colors"
                            title="Deletar"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input com menções */}
          <form onSubmit={handleSubmit} className="p-2 border-t border-slate-200 bg-slate-50 relative">
            {/* Lista de sugestões de menção */}
            {showMentions && filteredMembers.length > 0 && (
              <div className="absolute bottom-full left-2 right-2 mb-1 bg-white rounded-lg shadow-lg border border-slate-200 max-h-32 overflow-y-auto">
                {filteredMembers.map((member, idx) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => insertMention(member)}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                      idx === mentionIndex ? 'bg-amber-50' : ''
                    }`}
                  >
                    {member.imageUrl ? (
                      <img src={member.imageUrl} alt="" className="w-6 h-6 rounded-full" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                        <span className="text-[10px] text-slate-500">{member.name[0]}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">{member.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{member.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-1.5 items-center">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={newComment}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Comentário... Use @ para mencionar"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-amber-400 pr-8"
                />
                <AtSign className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
              </div>
              <button
                type="submit"
                disabled={!newComment.trim() || sending}
                className="px-2.5 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FieldComments;
