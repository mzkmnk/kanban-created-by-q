'use client';

import { useState } from 'react';
import { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from '@/types/kanban';
import { useKanban } from '@/hooks/useKanban';
import { KanbanColumn } from './KanbanColumn';
import { AddTaskDialog } from './AddTaskDialog';
import { EditTaskDialog } from './EditTaskDialog';
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core';
import { KanbanCard } from './KanbanCard';

export const KanbanBoard = () => {
  const { columns, isLoading, createTask, updateTask, deleteTask, moveTask } = useKanban();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>(TaskStatus.TODO);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = active.data.current?.task;
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = active.data.current?.task;
    const overColumn = over.data.current?.column;

    if (activeTask && overColumn && activeTask.status !== overColumn.status) {
      moveTask(activeTask.id, overColumn.status);
    }
  };

  const handleDragEnd = () => {
    setActiveTask(null);
  };

  const handleAddTask = (status: TaskStatus) => {
    setDefaultStatus(status);
    setShowAddDialog(true);
  };

  const handleCreateTask = (taskInput: CreateTaskInput) => {
    createTask(taskInput);
    setShowAddDialog(false);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowEditDialog(true);
  };

  const handleUpdateTask = (taskInput: UpdateTaskInput) => {
    updateTask(taskInput);
    setShowEditDialog(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    setShowEditDialog(false);
    setSelectedTask(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading Kanban board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3 opacity-90">
              <KanbanCard
                task={activeTask}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <AddTaskDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSubmit={handleCreateTask}
        defaultStatus={defaultStatus}
      />

      <EditTaskDialog
        isOpen={showEditDialog}
        task={selectedTask}
        onClose={() => {
          setShowEditDialog(false);
          setSelectedTask(null);
        }}
        onSubmit={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};
