import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { KanbanTask } from '@/data/newFeaturesData';
import { KanbanCard } from './KanbanCard';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AddContentModal } from '@/components/calendar/AddContentModal';

interface KanbanColumnProps {
  columnId: string;
  columnTitle: string;
  tasks: KanbanTask[];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  columnId,
  columnTitle,
  tasks,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleManualUpload = () => {
    console.log(`Manual upload for column: ${columnId}`);
  };

  const handleCreateWithAgents = () => {
    console.log(`Create with agents for column: ${columnId}`);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Column Header */}
      <div className="flex justify-between items-center px-1 mb-1">
        <h2 className="text-base font-semibold tracking-tight text-slate-900">
          {columnTitle}{' '}
          <span className="text-slate-300 ml-1.5 font-normal text-sm">{tasks.length}</span>
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={columnId} type="CARD">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'min-h-[150px] transition-all duration-200',
              snapshot.isDraggingOver && 'opacity-50'
            )}
          >
            <div className="space-y-3">
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <KanbanCard key={task.id} task={task} index={index} />
                ))
              ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-xl h-32 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center mb-2">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">
                    {columnId === 'todo' && 'Drag the card to this window'}
                    {columnId === 'inprogress' && 'Drag the card to this window'}
                    {columnId === 'done' && 'Drag the card to this window'}
                  </span>
                </div>
              )}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>

      {/* Add Content Modal */}
      <AddContentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onManualUpload={handleManualUpload}
        onCreateWithAgents={handleCreateWithAgents}
      />
    </div>
  );
};
