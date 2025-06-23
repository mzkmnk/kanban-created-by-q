"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KanbanCard } from './KanbanCard';
import { Column, Task, TaskStatus } from '@/types/kanban';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  column: Column;
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, fromStatus: TaskStatus, toStatus: TaskStatus) => void;
}

const columnColors = {
  [TaskStatus.TODO]: 'border-blue-200 bg-blue-50/50',
  [TaskStatus.IN_PROGRESS]: 'border-yellow-200 bg-yellow-50/50',
  [TaskStatus.DONE]: 'border-green-200 bg-green-50/50'
};

const headerColors = {
  [TaskStatus.TODO]: 'text-blue-700 bg-blue-100',
  [TaskStatus.IN_PROGRESS]: 'text-yellow-700 bg-yellow-100',
  [TaskStatus.DONE]: 'text-green-700 bg-green-100'
};

export function KanbanColumn({ 
  column, 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onMoveTask 
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      // タスクの現在のステータスを見つける
      const currentTask = column.tasks.find(task => task.id === taskId);
      if (currentTask && currentTask.status !== column.status) {
        onMoveTask(taskId, currentTask.status, column.status);
      } else {
        // 他のカラムからのドロップの場合、親コンポーネントで処理
        // ここでは簡単な実装として、すべてのステータスを試す
        const allStatuses = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];
        for (const status of allStatuses) {
          if (status !== column.status) {
            onMoveTask(taskId, status, column.status);
          }
        }
      }
    }
  };

  return (
    <Card className={cn(
      "kanban-column flex flex-col h-full min-h-[500px] transition-all duration-200",
      columnColors[column.status],
      isDragOver && "ring-2 ring-primary ring-offset-2 bg-primary/5"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold">
              {column.title}
            </CardTitle>
            <Badge 
              variant="secondary" 
              className={cn("text-xs", headerColors[column.status])}
            >
              {column.tasks.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-primary/10"
            onClick={() => onAddTask(column.status)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent 
        className={cn(
          "flex-1 space-y-3 drop-zone",
          isDragOver && "drag-over"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {column.tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-sm text-center">
              No tasks yet
              <br />
              <span className="text-xs">Click + to add a task</span>
            </p>
          </div>
        ) : (
          <div className="space-y-3 group">
            {column.tasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        )}
        
        {/* ドロップゾーン */}
        <div 
          className={cn(
            "drop-zone min-h-[50px] rounded-lg border-2 border-dashed border-transparent transition-all duration-200",
            isDragOver && "border-primary bg-primary/5"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragOver && (
            <div className="flex items-center justify-center h-12 text-sm text-primary font-medium">
              Drop task here
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
