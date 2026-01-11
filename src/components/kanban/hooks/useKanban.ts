import { useState, useCallback } from 'react';
import { KanbanTask } from '@/data/newFeaturesData';

export interface KanbanState {
  [key: string]: KanbanTask[];
}

export interface KanbanDragResult {
  source: {
    droppableId: string;
    index: number;
  };
  destination:
    | {
        droppableId: string;
        index: number;
      }
    | null
    | undefined;
  draggableId: string;
}

const INITIAL_COLUMNS = {
  draft: 'Rascunho',
  pending: 'Agendado',
  approved: 'Aprovado',
  published: 'Publicado',
  review: 'Em Análise',
};

export const useKanban = (initialTasks: KanbanTask[]) => {
  const [tasks, setTasks] = useState<KanbanState>(() => {
    const grouped: KanbanState = {
      draft: [],
      pending: [],
      approved: [],
      published: [],
      review: [],
    };

    initialTasks.forEach((task) => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });

    return grouped;
  });

  const handleDragEnd = useCallback((result: KanbanDragResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };
      const sourceColumn = [...newTasks[source.droppableId]];
      const destColumn = [...newTasks[destination.droppableId]];

      const [movedTask] = sourceColumn.splice(source.index, 1);
      movedTask.status = destination.droppableId as KanbanTask['status'];

      if (source.droppableId === destination.droppableId) {
        newTasks[source.droppableId] = sourceColumn;
      } else {
        newTasks[source.droppableId] = sourceColumn;
        destColumn.splice(destination.index, 0, movedTask);
        newTasks[destination.droppableId] = destColumn;
      }

      return newTasks;
    });
  }, []);

  const getTaskCount = useCallback(
    (status: string) => {
      return tasks[status]?.length || 0;
    },
    [tasks]
  );

  return {
    tasks,
    handleDragEnd,
    columns: INITIAL_COLUMNS,
    getTaskCount,
  };
};
