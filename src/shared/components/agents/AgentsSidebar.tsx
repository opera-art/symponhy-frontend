'use client';

import React, { useState } from 'react';
import { PixelMaestro } from './PixelMaestro';
import { PixelMusician } from './PixelMusician';
import { ChevronLeft, ChevronRight, Sparkles, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Agent {
  id: string;
  name: string;
  role: string;
  instrument: 'violin' | 'cello' | 'flute' | 'trumpet' | 'drums';
  hairColor: '#1E293B' | '#8B5CF6' | '#F59E0B' | '#EF4444' | '#10B981';
  status: 'active' | 'idle' | 'working';
  description: string;
}

const agents: Agent[] = [
  {
    id: 'harmonia',
    name: 'Harmonia',
    role: 'Content Creator',
    instrument: 'violin',
    hairColor: '#8B5CF6',
    status: 'active',
    description: 'Cria conteúdo personalizado'
  },
  {
    id: 'tempo',
    name: 'Tempo',
    role: 'Scheduler',
    instrument: 'drums',
    hairColor: '#F59E0B',
    status: 'working',
    description: 'Agenda posts automaticamente'
  },
  {
    id: 'melody',
    name: 'Melody',
    role: 'Analyst',
    instrument: 'flute',
    hairColor: '#10B981',
    status: 'active',
    description: 'Analisa métricas e insights'
  },
  {
    id: 'rhythm',
    name: 'Rhythm',
    role: 'Engagement',
    instrument: 'trumpet',
    hairColor: '#EF4444',
    status: 'idle',
    description: 'Gerencia engajamento'
  },
  {
    id: 'cadenza',
    name: 'Cadenza',
    role: 'Strategist',
    instrument: 'cello',
    hairColor: '#1E293B',
    status: 'active',
    description: 'Planeja estratégia de conteúdo'
  }
];

export const AgentsSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const activeAgents = agents.filter(a => a.status === 'active' || a.status === 'working').length;

  return (
    <>
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes baton-wave {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          25% { transform: rotate(-15deg) translateY(1px); }
          75% { transform: rotate(10deg) translateY(-1px); }
        }
        @keyframes left-arm-sway {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes head-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(1px); }
        }
        @keyframes musician-play {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(1px); }
        }
        @keyframes note-float {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-20px) scale(0.5); }
        }
        .animate-baton {
          animation: baton-wave 1.5s infinite ease-in-out;
          transform-origin: 20px 14px;
        }
        .animate-left-arm {
          animation: left-arm-sway 1.5s infinite ease-in-out;
          animation-delay: 0.2s;
        }
        .animate-head {
          animation: head-bob 1s infinite ease-in-out;
        }
        .animate-musician-head {
          animation: head-bob 1.2s infinite ease-in-out;
        }
        .animate-violin, .animate-cello, .animate-flute, .animate-trumpet {
          animation: musician-play 0.8s infinite ease-in-out;
        }
        .animate-drums {
          animation: musician-play 0.4s infinite ease-in-out;
        }
        .note-float {
          animation: note-float 2s infinite ease-out;
        }
        .pixel-art {
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }
      `}</style>

      {/* Sidebar Container */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-white border-l border-slate-100 transition-all duration-300 overflow-hidden',
          isExpanded ? 'w-72' : 'w-16'
        )}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors z-10"
        >
          {isExpanded ? (
            <ChevronRight className="w-3 h-3 text-slate-500" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-slate-500" />
          )}
        </button>

        {isExpanded ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  Orquestra AI
                </h3>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-medium text-emerald-700">{activeAgents} ativos</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">Seus agentes trabalhando em harmonia</p>
            </div>

            {/* Orchestra Stage */}
            <div className="p-4 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
              {/* Spotlight Effect */}
              <div className="relative flex flex-col items-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-32 bg-gradient-to-b from-amber-200/30 to-transparent blur-2xl pointer-events-none" />

                {/* Maestro */}
                <div className="relative z-10 mb-2">
                  <PixelMaestro size={56} isAnimating={true} />
                  <div className="text-center mt-1">
                    <p className="text-[10px] font-semibold text-slate-700">Maestro</p>
                    <p className="text-[8px] text-slate-500">Orquestrando agentes</p>
                  </div>
                </div>

                {/* Music Notes Animation */}
                <div className="absolute top-4 left-8 note-float" style={{ animationDelay: '0s' }}>
                  <span className="text-lg">♪</span>
                </div>
                <div className="absolute top-2 right-8 note-float" style={{ animationDelay: '0.5s' }}>
                  <span className="text-sm text-gold">♫</span>
                </div>
                <div className="absolute top-8 right-12 note-float" style={{ animationDelay: '1s' }}>
                  <span className="text-xs text-indigo-400">♬</span>
                </div>

                {/* Musicians Row */}
                <div className="flex items-end justify-center gap-1 mt-2 relative z-10">
                  {agents.slice(0, 3).map((agent, index) => (
                    <div
                      key={agent.id}
                      className={cn(
                        'cursor-pointer transition-transform hover:scale-110',
                        selectedAgent?.id === agent.id && 'scale-110'
                      )}
                      onClick={() => setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)}
                    >
                      <PixelMusician
                        instrument={agent.instrument}
                        hairColor={agent.hairColor}
                        size={36}
                        isPlaying={agent.status !== 'idle'}
                      />
                    </div>
                  ))}
                </div>

                {/* Second Row */}
                <div className="flex items-end justify-center gap-2 mt-1 relative z-10">
                  {agents.slice(3).map((agent) => (
                    <div
                      key={agent.id}
                      className={cn(
                        'cursor-pointer transition-transform hover:scale-110',
                        selectedAgent?.id === agent.id && 'scale-110'
                      )}
                      onClick={() => setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)}
                    >
                      <PixelMusician
                        instrument={agent.instrument}
                        hairColor={agent.hairColor}
                        size={32}
                        isPlaying={agent.status !== 'idle'}
                      />
                    </div>
                  ))}
                </div>

                {/* Stage Floor */}
                <div className="w-full h-2 bg-gradient-to-r from-amber-900/20 via-amber-800/30 to-amber-900/20 rounded-full mt-2" />
              </div>
            </div>

            {/* Agent Details Card */}
            {selectedAgent && (
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                    <PixelMusician
                      instrument={selectedAgent.instrument}
                      hairColor={selectedAgent.hairColor}
                      size={28}
                      isPlaying={false}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-800">{selectedAgent.name}</h4>
                      <span className={cn(
                        'px-1.5 py-0.5 rounded text-[9px] font-medium',
                        selectedAgent.status === 'active' && 'bg-emerald-100 text-emerald-700',
                        selectedAgent.status === 'working' && 'bg-amber-100 text-amber-700',
                        selectedAgent.status === 'idle' && 'bg-slate-100 text-slate-500'
                      )}>
                        {selectedAgent.status === 'active' && 'Ativo'}
                        {selectedAgent.status === 'working' && 'Trabalhando'}
                        {selectedAgent.status === 'idle' && 'Aguardando'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{selectedAgent.role}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{selectedAgent.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Agents List */}
            <div className="flex-1 overflow-y-auto p-3">
              <div className="space-y-2">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)}
                    className={cn(
                      'w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left',
                      selectedAgent?.id === agent.id
                        ? 'bg-gold/10 border border-gold/20'
                        : 'hover:bg-slate-50 border border-transparent'
                    )}
                  >
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      agent.status === 'active' && 'bg-emerald-500',
                      agent.status === 'working' && 'bg-amber-500 animate-pulse',
                      agent.status === 'idle' && 'bg-slate-300'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">{agent.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{agent.role}</p>
                    </div>
                    <Activity className={cn(
                      'w-3.5 h-3.5',
                      agent.status === 'working' ? 'text-amber-500' : 'text-slate-300'
                    )} />
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Stats */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{activeAgents}</p>
                  <p className="text-[9px] text-slate-500">Ativos</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gold">24</p>
                  <p className="text-[9px] text-slate-500">Tarefas/dia</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-600">98%</p>
                  <p className="text-[9px] text-slate-500">Sucesso</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Collapsed State */
          <div className="flex flex-col items-center py-4 gap-4">
            <div className="relative">
              <PixelMaestro size={32} isAnimating={true} />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 text-[8px] text-white flex items-center justify-center font-bold">
                  {activeAgents}
                </span>
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={cn(
                    'w-3 h-3 rounded-full cursor-pointer transition-transform hover:scale-125',
                    agent.status === 'active' && 'bg-emerald-500',
                    agent.status === 'working' && 'bg-amber-500 animate-pulse',
                    agent.status === 'idle' && 'bg-slate-300'
                  )}
                  title={`${agent.name} - ${agent.role}`}
                />
              ))}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
