'use client';

import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { KanbanTask } from '@/data/newFeaturesData';
import { KanbanColumn } from './KanbanColumn';
import { useKanban } from '../hooks/useKanban';
import { ChevronDown, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KanbanBoardProps {
  tasks: KanbanTask[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks }) => {
  const { tasks: organizedTasks, handleDragEnd } = useKanban(tasks);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleDragEndWrapper = (result: DropResult) => {
    handleDragEnd({
      source: result.source,
      destination: result.destination,
      draggableId: result.draggableId,
    });
  };

  // Reorganize tasks into simplified columns: To Do, In Progress, Done
  const simplifiedColumns = {
    todo: {
      title: 'To Do',
      tasks: [...(organizedTasks.draft || []), ...(organizedTasks.pending || [])],
    },
    inprogress: {
      title: 'In progress',
      tasks: [...(organizedTasks.review || []), ...(organizedTasks.approved || [])],
    },
    done: {
      title: 'Done',
      tasks: organizedTasks.published || [],
    },
  };

  return (
    <div className="w-full h-full bg-slate-50 -m-8 p-6">
      {/* Header Navigation */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <nav className="flex items-center gap-4 overflow-x-auto hide-scrollbar w-full md:w-auto">
          <a
            href="#"
            className="text-[#D4AF37] font-semibold border-b-2 border-[#D4AF37] pb-1.5 px-1 text-sm whitespace-nowrap"
          >
            Board
          </a>
          <a href="#" className="text-slate-400 hover:text-slate-600 pb-1.5 px-1 text-sm font-medium whitespace-nowrap">
            Timeline
          </a>
          <a href="#" className="text-slate-400 hover:text-slate-600 pb-1.5 px-1 text-sm font-medium whitespace-nowrap">
            Polls
          </a>
          <a href="#" className="text-slate-400 hover:text-slate-600 pb-1.5 px-1 text-sm font-medium flex items-center gap-1.5 whitespace-nowrap">
            Groups <span className="text-slate-300 text-xs font-normal">3</span>
          </a>
        </nav>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-lg px-3 py-1.5 text-slate-600 text-xs font-medium shadow-sm hover:bg-slate-50 transition-colors">
            Sort by date
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <div className="flex items-center bg-white border border-slate-100 rounded-lg p-0.5 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                viewMode === 'grid' ? 'bg-[#D4AF37] text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                viewMode === 'list' ? 'bg-[#D4AF37] text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Board Grid */}
      <DragDropContext onDragEnd={handleDragEndWrapper}>
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start relative">
          {Object.entries(simplifiedColumns).map(([columnId, column]) => (
            <KanbanColumn
              key={columnId}
              columnId={columnId}
              columnTitle={column.title}
              tasks={column.tasks}
            />
          ))}
        </main>
      </DragDropContext>
    </div>
  );
};
