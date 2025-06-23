'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { AddTaskDialog } from './AddTaskDialog';
import { EditTaskDialog } from './EditTaskDialog';
import { useKanban } from '@/hooks/useKanban';
import { Task, TaskStatus } from '@/types/kanban';

export const KanbanBoard = () => {
  const { columns, addTask, updateTask, deleteTask, moveTask, getTask } = useKanban();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = getTask(active.id as string);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // If dropping over a column
    if (overId === 'todo' || overId === 'in-progress' || overId === 'done') {
      const task = getTask(activeId);
      if (task && task.status !== overId) {
        moveTask(activeId, overId as TaskStatus);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle reordering within the same column
    const activeTask = getTask(activeId);
    const overTask = getTask(overId);

    if (activeTask && overTask && activeTask.status === overTask.status) {
      const column = columns.find(col => col.id === activeTask.status);
      if (column) {
        const oldIndex = column.tasks.findIndex(task => task.id === activeId);
        const newIndex = column.tasks.findIndex(task => task.id === overId);
        
        if (oldIndex !== newIndex) {
          // This would require more complex state management for reordering
          // For now, we'll keep it simple and just handle column changes
        }
      }
    }

    setActiveTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditingTask(null);
    setEditDialogOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kanban Board
          </h1>
          <p className="text-gray-600 mb-4">
            Manage your tasks efficiently with drag and drop functionality
          </p>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Total tasks: {columns.reduce((sum, col) => sum + col.tasks.length, 0)}
            </div>
            <AddTaskDialog onAddTask={addTask} />
          </div>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onEditTask={handleEditTask}
                onDeleteTask={deleteTask}
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

        <EditTaskDialog
          task={editingTask}
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
        />
      </div>
    </div>
  );
};
