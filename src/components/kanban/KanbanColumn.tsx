'use client';

import { Column, Task, TaskStatus } from '@/types/kanban';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { KanbanCard } from './KanbanCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface KanbanColumnProps {
  column: Column;
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const columnStyles = {
  [TaskStatus.TODO]: {
    header: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-100 text-blue-800'
  },
  [TaskStatus.IN_PROGRESS]: {
    header: 'bg-yellow-50 border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-800'
  },
  [TaskStatus.DONE]: {
    header: 'bg-green-50 border-green-200',
    badge: 'bg-green-100 text-green-800'
  }
};

export const KanbanColumn = ({ 
  column, 
  onAddTask, 
  onEditTask, 
  onDeleteTask 
}: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      column
    }
  });

  const taskIds = column.tasks.map(task => task.id);

  return (
    <Card className="flex flex-col h-full min-h-[600px]">
      <CardHeader className={`pb-3 ${columnStyles[column.status].header}`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {column.title}
          </CardTitle>
          <Badge 
            variant="secondary" 
            className={columnStyles[column.status].badge}
          >
            {column.tasks.length}
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={() => onAddTask(column.status)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 p-3">
        <div
          ref={setNodeRef}
          className={`min-h-full rounded-lg transition-colors duration-200 ${
            isOver ? 'bg-muted/50' : ''
          }`}
        >
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <KanbanCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))}
              {column.tasks.length === 0 && (
                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm border-2 border-dashed border-muted rounded-lg">
                  Drop tasks here or click &quot;Add Task&quot; to get started
                </div>
              )}
            </div>
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  );
};
