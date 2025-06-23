'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/kanban';
import { Pencil, Trash2, GripVertical } from 'lucide-react';

interface KanbanCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const KanbanCard = ({ task, onEdit, onDelete }: KanbanCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'done':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md ${
        isDragging ? 'shadow-lg ring-2 ring-blue-500 ring-opacity-50' : ''
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium line-clamp-2 flex-1">
            {task.title}
          </CardTitle>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-100"
              onClick={() => onEdit(task)}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            <div
              {...attributes}
              {...listeners}
              className="h-6 w-6 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded"
            >
              <GripVertical className="h-3 w-3 text-gray-400" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {task.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-3">
            {task.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <Badge 
            variant="secondary" 
            className={`text-xs ${getStatusBadgeColor(task.status)}`}
          >
            {task.status === 'todo' && 'To Do'}
            {task.status === 'in-progress' && 'In Progress'}
            {task.status === 'done' && 'Done'}
          </Badge>
          <span className="text-xs text-gray-400">
            {formatDate(task.updatedAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
