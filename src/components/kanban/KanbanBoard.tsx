"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KanbanColumn } from './KanbanColumn';
import { AddTaskDialog } from './AddTaskDialog';
import { EditTaskDialog } from './EditTaskDialog';
import { useKanban } from '@/hooks/useKanban';
import { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from '@/types/kanban';
import { Plus, BarChart3, RefreshCw } from 'lucide-react';

export function KanbanBoard() {
  const { 
    board, 
    isLoading, 
    createTask, 
    updateTask, 
    deleteTask, 
    moveTask, 
    getTaskCounts 
  } = useKanban();
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>(TaskStatus.TODO);

  const taskCounts = getTaskCounts();

  const handleAddTask = (status: TaskStatus) => {
    setDefaultStatus(status);
    setAddDialogOpen(true);
  };

  const handleCreateTask = (input: CreateTaskInput) => {
    createTask(input);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setEditDialogOpen(true);
  };

  const handleUpdateTask = (input: UpdateTaskInput) => {
    updateTask(input);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleMoveTask = (taskId: string, fromStatus: TaskStatus, toStatus: TaskStatus) => {
    moveTask(taskId, fromStatus, toStatus);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading Kanban Board...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ヘッダー */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800">
                  {board.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your tasks efficiently with drag & drop
                </p>
              </div>
              <Button
                onClick={() => handleAddTask(TaskStatus.TODO)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Task Overview:</span>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  To Do: {taskCounts.todo}
                </Badge>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  In Progress: {taskCounts.inProgress}
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Done: {taskCounts.done}
                </Badge>
                <Badge variant="secondary">
                  Total: {taskCounts.total}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kanbanボード */}
        <div className="kanban-board grid grid-cols-1 md:grid-cols-3 gap-6">
          {board.columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onMoveTask={handleMoveTask}
            />
          ))}
        </div>

        {/* フッター */}
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="py-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>Last updated: {new Intl.DateTimeFormat('ja-JP', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }).format(board.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💡 Tip: Drag tasks between columns to change their status</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ダイアログ */}
      <AddTaskDialog
        isOpen={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleCreateTask}
        defaultStatus={defaultStatus}
      />

      <EditTaskDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleUpdateTask}
        onDelete={handleDeleteTask}
        task={selectedTask}
      />
    </div>
  );
}
