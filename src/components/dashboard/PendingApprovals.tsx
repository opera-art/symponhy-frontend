'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Approval {
  id: string;
  title: string;
  type: 'post' | 'carousel' | 'reel' | 'story';
  scheduledDate: string;
  thumbnail?: string;
}

interface PendingApprovalsProps {
  approvals: Approval[];
  isLoading?: boolean;
}

const PendingApprovals: React.FC<PendingApprovalsProps> = ({
  approvals,
  isLoading = false,
}) => {
  const typeLabels = {
    post: 'Post',
    carousel: 'Carrossel',
    reel: 'Reel',
    story: 'Story',
  };

  if (isLoading) {
    return (
      <Card padding="lg">
        <CardHeader>
          <CardTitle>Aprovações Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-xl animate-shimmer" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (approvals.length === 0) {
    return (
      <Card padding="lg">
        <CardHeader>
          <CardTitle>Aprovações Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-status-success mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-500 text-center">
              Nenhuma aprovação pendente
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Aprovações Pendentes</CardTitle>
          <Badge variant="warning" dot>
            {approvals.length} {approvals.length === 1 ? 'pendente' : 'pendentes'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {approvals.slice(0, 5).map((approval) => (
            <div
              key={approval.id}
              className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              {/* Thumbnail */}
              {approval.thumbnail ? (
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                  <img
                    src={approval.thumbnail}
                    alt={approval.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-lg bg-slate-200 flex-shrink-0" />
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-800 truncate">
                  {approval.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge size="sm" variant="default">
                    {typeLabels[approval.type]}
                  </Badge>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {approval.scheduledDate}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  className="w-8 h-8 rounded-lg bg-emerald-50 text-status-success hover:bg-emerald-100 transition-colors flex items-center justify-center"
                  aria-label="Aprovar"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button
                  className="w-8 h-8 rounded-lg bg-rose-50 text-status-error hover:bg-rose-100 transition-colors flex items-center justify-center"
                  aria-label="Reprovar"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {approvals.length > 5 && (
          <div className="mt-6">
            <Link href="/dashboard/content?tab=pending">
              <Button variant="secondary" className="w-full">
                Ver todas ({approvals.length})
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { PendingApprovals };
