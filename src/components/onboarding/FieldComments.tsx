'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, X, Check, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

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
  const { userId, getToken } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.viol1n.com';

  // Buscar comentários do campo
  const fetchComments = async () => {
    if (!briefingUserId) return;

    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(
        `${API_URL}/api/comments/${onboardingType}/${briefingUserId}/${fieldName}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
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
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, fieldName, briefingUserId]);

  // Criar comentário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || sending) return;

    setSending(true);
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          clerkUserId: briefingUserId,
          onboardingType,
          fieldName,
          comment: newComment.trim(),
        }),
      });

      if (response.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setSending(false);
    }
  };

  // Resolver comentário
  const handleResolve = async (commentId: string) => {
    try {
      const token = await getToken();
      await fetch(`${API_URL}/api/comments/${onboardingType}/${commentId}/resolve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchComments();
    } catch (error) {
      console.error('Error resolving comment:', error);
    }
  };

  // Deletar comentário
  const handleDelete = async (commentId: string) => {
    try {
      const token = await getToken();
      await fetch(`${API_URL}/api/comments/${onboardingType}/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const unresolvedCount = comments.filter(c => !c.resolved).length;

  return (
    <div className="relative">
      {/* Botão de comentários */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 rounded-lg transition-all ${
          unresolvedCount > 0
            ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
            : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
        }`}
        title={`${comments.length} comentário(s)`}
      >
        <MessageCircle className="w-4 h-4" />
        {unresolvedCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
            {unresolvedCount}
          </span>
        )}
      </button>

      {/* Painel de comentários */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <span className="text-sm font-medium text-slate-700">
              Comentários ({comments.length})
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Lista de comentários */}
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-slate-400 text-sm">
                Carregando...
              </div>
            ) : comments.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-sm">
                Nenhum comentário ainda
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-3 ${comment.resolved ? 'bg-slate-50 opacity-60' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-600">
                          {comment.author_name || 'Usuário'}
                        </p>
                        <p className={`text-sm mt-1 ${comment.resolved ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {comment.comment}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {new Date(comment.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      {/* Ações */}
                      <div className="flex items-center gap-1">
                        {!comment.resolved && (
                          <button
                            onClick={() => handleResolve(comment.id)}
                            className="p-1 hover:bg-green-100 rounded text-slate-400 hover:text-green-600 transition-colors"
                            title="Marcar como resolvido"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {comment.author_clerk_user_id === userId && (
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="p-1 hover:bg-red-100 rounded text-slate-400 hover:text-red-600 transition-colors"
                            title="Deletar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input de novo comentário */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 bg-slate-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicionar comentário..."
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={!newComment.trim() || sending}
                className="px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FieldComments;
