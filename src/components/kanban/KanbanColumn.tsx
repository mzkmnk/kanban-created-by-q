'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { KanbanCard } from './KanbanCard';
import { Column, Task } from '@/types/kanban';

interface KanbanColumnProps {
  column: Column;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const KanbanColumn = ({ column, onEditTask, onDeleteTask }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case 'todo':
        return {
          header: 'bg-gray-50 border-gray-200',
          badge: 'bg-gray-100 text-gray-800',
          dropZone: 'border-gray-300'
        };
      case 'in-progress':
        return {
          header: 'bg-blue-50 border-blue-200',
          badge: 'bg-blue-100 text-blue-800',
          dropZone: 'border-blue-300'
        };
      case 'done':
        return {
          header: 'bg-green-50 border-green-200',
          badge: 'bg-green-100 text-green-800',
          dropZone: 'border-green-300'
        };
      default:
        return {
          header: 'bg-gray-50 border-gray-200',
          badge: 'bg-gray-100 text-gray-800',
          dropZone: 'border-gray-300'
        };
    }
  };

  const colors = getColumnColor(column.id);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className={`pb-3 ${colors.header} rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-gray-700">
            {column.title}
          </CardTitle>
          <Badge variant="secondary" className={`text-xs ${colors.badge}`}>
            {column.tasks.length}
          </Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex-1 p-3">
        <div
          ref={setNodeRef}
          className={`min-h-[200px] space-y-3 p-2 rounded-lg border-2 border-dashed transition-colors ${
            isOver 
              ? `${colors.dropZone} bg-opacity-10` 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <SortableContext 
            items={column.tasks.map(task => task.id)} 
            strategy={verticalListSortingStrategy}
          >
            {column.tasks.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                {isOver ? 'Drop task here' : 'No tasks'}
              </div>
            ) : (
              column.tasks.map((task) => (
                <KanbanCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))
            )}
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  );
};
