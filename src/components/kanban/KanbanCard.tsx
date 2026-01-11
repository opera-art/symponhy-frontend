import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { KanbanTask } from '@/data/newFeaturesData';
import { cn } from '@/lib/utils';
import { Paperclip, MessageSquare, Clock, MoreHorizontal, ExternalLink, Video } from 'lucide-react';

interface KanbanCardProps {
  task: KanbanTask;
  index: number;
}

const tagColors = {
  post: 'bg-purple-50 text-purple-600',
  reel: 'bg-yellow-50 text-yellow-600',
  carousel: 'bg-blue-50 text-blue-500',
  story: 'bg-green-50 text-green-600',
  short: 'bg-[#FFF4E0] text-[#D4AF37]',
};

const priorityToColor = {
  high: 'bg-[#FFF4E0] text-[#D4AF37]',
  medium: 'bg-green-50 text-green-600',
  low: 'bg-purple-50 text-purple-600',
};

export const KanbanCard: React.FC<KanbanCardProps> = ({ task, index }) => {
  // Determine if card is being dragged or completed
  const isCompleted = task.status === 'published';
  const showProgress = task.progress !== undefined && task.progress < 100;
  const showMeeting = task.priority === 'medium' && !isCompleted;

  // Map task type to tag
  const tagColor = tagColors[task.type] || priorityToColor[task.priority];
  const tagLabel = task.type === 'post' ? 'Motion Design' :
                   task.type === 'reel' ? 'Development' :
                   task.type === 'carousel' ? 'Testing' :
                   task.type === 'short' ? 'Research' :
                   'UI&UX Design';

  // Generate random avatars for demo
  const avatars = task.assigneeAvatar ?
    [task.assigneeAvatar, `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}`] :
    [`https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}`, `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}`];

  const attachments = Math.floor(Math.random() * 5) + 1;
  const comments = Math.floor(Math.random() * 10) + 1;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            'bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer',
            snapshot.isDragging && 'rotate-6 scale-105 shadow-2xl'
          )}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <span className={cn(
              'text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide',
              tagColor
            )}>
              {tagLabel}
            </span>
            <MoreHorizontal className="w-4 h-4 text-slate-300" />
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold mb-1.5 tracking-tight text-slate-900 line-clamp-2">
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="text-slate-400 text-xs mb-3 leading-relaxed line-clamp-1">
              {task.description}
            </p>
          )}

          {/* Meeting Button */}
          {showMeeting && (
            <button className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mb-3 hover:bg-slate-50 px-2 py-1.5 rounded-lg -ml-2 w-fit transition-colors">
              <div className="w-6 h-6 rounded-full bg-green-100 text-green-500 flex items-center justify-center">
                <Video className="w-3 h-3 fill-current" />
              </div>
              Start meeting
            </button>
          )}

          {/* Progress Bar */}
          {showProgress && (
            <div className="mb-3">
              <div className="flex justify-between items-end mb-1">
                <span className="text-[10px] text-slate-400">Progress</span>
                <span className="text-[#D4AF37] text-[10px] font-semibold">
                  {Math.floor(task.progress / 14.28)} / 7
                </span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 w-full rounded-full',
                      i < Math.floor(task.progress / 14.28) ? 'bg-[#D4AF37]' : 'bg-slate-100'
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Image Placeholder - for completed tasks */}
          {isCompleted && task.thumbnail && (
            <div className="bg-slate-50 rounded-lg mb-3 overflow-hidden border border-slate-100 relative h-20 flex items-center justify-center">
              <img src={task.thumbnail} alt={task.title} className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 p-2">
                <div className="w-full h-full relative">
                  {/* Decorative floating cards - smaller */}
                  <div className="absolute top-1 left-1 bg-white shadow-sm w-10 h-8 rounded border border-slate-100 z-10 flex flex-col p-0.5 gap-0.5">
                    <div className="h-0.5 bg-blue-100 w-1/2 rounded"></div>
                    <div className="h-0.5 bg-slate-100 w-full rounded"></div>
                    <div className="h-2 w-2 bg-blue-400 rounded-full self-end mt-auto opacity-20"></div>
                  </div>
                  <div className="absolute top-3 left-6 bg-white shadow-md w-14 h-10 rounded-lg border border-slate-100 z-20 flex flex-col p-1 gap-1 transform -rotate-3">
                    <div className="flex gap-0.5">
                      <div className="h-3 w-3 rounded bg-blue-500 opacity-20"></div>
                      <div className="h-1 w-5 bg-slate-100 rounded mt-0.5"></div>
                    </div>
                    <div className="h-0.5 bg-slate-100 w-full rounded"></div>
                  </div>
                  <div className="absolute bottom-0.5 right-1 bg-white shadow-sm w-8 h-6 rounded border border-slate-100 z-10 p-0.5">
                    <div className="h-1 w-1 rounded-full bg-green-400 opacity-30 mb-0.5"></div>
                    <div className="h-0.5 bg-slate-100 w-full rounded"></div>
                  </div>
                  <div className="absolute top-0.5 right-2 w-1.5 h-1.5 rounded-full bg-yellow-400 opacity-60"></div>
                  <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full border border-blue-200"></div>
                </div>
              </div>
            </div>
          )}

          {/* Attachments and Comments */}
          {!isCompleted && !showProgress && (
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <Paperclip className="w-3 h-3" />
                <span>{attachments}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <MessageSquare className="w-3 h-3" />
                <span>{comments}</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center border-t border-slate-50 pt-2.5">
            {/* Avatars */}
            <div className="flex -space-x-1.5">
              {avatars.slice(0, 2).map((avatar, i) => (
                <img
                  key={i}
                  src={avatar}
                  alt="Avatar"
                  className="w-6 h-6 rounded-full border-2 border-white"
                />
              ))}
              {avatars.length > 2 && (
                <div className="w-6 h-6 rounded-full border-2 border-white bg-[#FFF4E0] text-[#D4AF37] flex items-center justify-center text-[10px] font-semibold">
                  +{avatars.length - 2}
                </div>
              )}
            </div>

            {/* Date or Open Link */}
            {isCompleted ? (
              <div className="flex items-center gap-1 text-slate-800 text-xs font-semibold hover:text-[#D4AF37] transition-colors cursor-pointer">
                <ExternalLink className="w-3 h-3 text-slate-400" />
                <span className="border-b border-slate-300">Open</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                <Clock className="w-3 h-3" />
                <span>{new Date(task.dueDate).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};
