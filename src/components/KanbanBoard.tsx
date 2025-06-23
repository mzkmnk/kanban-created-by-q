/**
 * Kanban Board Component
 * Worker3 Implementation - Advanced board with drag & drop and comprehensive features
 */

"use client";

import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { AlertCircle, RefreshCw, Settings, BarChart3, X } from 'lucide-react';
import { KanbanCard as KanbanCardType, TaskStatus } from '@/types/kanban';
import { useKanban } from '@/hooks/useKanban';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { AddCardModal } from './AddCardModal';
import { EditCardModal } from './EditCardModal';

export function KanbanBoard() {
  const {
    board,
    isLoading,
    error,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    reorderCards,
    clearError,
  } = useKanban();

  const [activeCard, setActiveCard] = useState<KanbanCardType | null>(null);
  const [addCardModal, setAddCardModal] = useState<{
    isOpen: boolean;
    columnId: string;
    columnStatus: TaskStatus;
    columnTitle: string;
  }>({
    isOpen: false,
    columnId: '',
    columnStatus: 'todo',
    columnTitle: '',
  });
  const [editCardModal, setEditCardModal] = useState<{
    isOpen: boolean;
    card: KanbanCardType | null;
  }>({
    isOpen: false,
    card: null,
  });

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before drag starts
      },
    })
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    
    if (active.data.current?.type === 'card') {
      setActiveCard(active.data.current.card);
    }
  };

  // Handle drag over (for visual feedback)
  const handleDragOver = (event: DragOverEvent) => {
    // This is handled by the droppable components
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // If dropping on the same position, do nothing
    if (activeId === overId) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData || activeData.type !== 'card') return;

    const activeCard = activeData.card as KanbanCardType;

    // Case 1: Dropping on a column (change status)
    if (overData?.type === 'column') {
      const newStatus = overData.status as TaskStatus;
      if (activeCard.status !== newStatus) {
        moveCard(activeCard.id, newStatus);
      }
      return;
    }

    // Case 2: Dropping on another card (reorder within column or move to different column)
    if (overData?.type === 'card') {
      const overCard = overData.card as KanbanCardType;
      
      // If cards are in different columns, move to the target column
      if (activeCard.status !== overCard.status) {
        moveCard(activeCard.id, overCard.status);
        return;
      }

      // If cards are in the same column, reorder them
      const column = board.columns.find(col => col.status === activeCard.status);
      if (column) {
        const oldIndex = column.cards.findIndex(card => card.id === activeCard.id);
        const newIndex = column.cards.findIndex(card => card.id === overCard.id);
        
        if (oldIndex !== newIndex) {
          const newCardIds = arrayMove(
            column.cards.map(card => card.id),
            oldIndex,
            newIndex
          );
          reorderCards(column.id, newCardIds);
        }
      }
    }
  };

  // Handle add card
  const handleAddCard = (columnId: string, columnStatus: TaskStatus, columnTitle: string) => {
    setAddCardModal({
      isOpen: true,
      columnId,
      columnStatus,
      columnTitle,
    });
  };

  // Handle add card submit
  const handleAddCardSubmit = (cardData: any) => {
    const { columnId } = addCardModal;
    addCard(columnId, {
      ...cardData,
      status: addCardModal.columnStatus,
      dueDate: cardData.dueDate ? new Date(cardData.dueDate) : undefined,
    });
  };

  // Handle edit card
  const handleEditCard = (card: KanbanCardType) => {
    setEditCardModal({
      isOpen: true,
      card,
    });
  };

  // Calculate board statistics
  const totalCards = board.columns.reduce((sum, column) => sum + column.cards.length, 0);
  const urgentCards = board.columns.reduce(
    (sum, column) => sum + column.cards.filter(card => card.priority === 'urgent').length,
    0
  );
  const overdueCards = board.columns.reduce(
    (sum, column) => sum + column.cards.filter(card => 
      card.dueDate && new Date(card.dueDate) < new Date()
    ).length,
    0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2 text-gray-600">
          <RefreshCw className="animate-spin" size={20} />
          <span>Loading Kanban board...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Board Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{board.title}</h1>
            {board.description && (
              <p className="text-gray-600 mt-1">{board.description}</p>
            )}
          </div>
          
          {/* Board Stats */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalCards}</div>
              <div className="text-xs text-gray-500">Total Cards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{urgentCards}</div>
              <div className="text-xs text-gray-500">Urgent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{overdueCards}</div>
              <div className="text-xs text-gray-500">Overdue</div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2 ml-6">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <BarChart3 size={20} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex-shrink-0 bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
          <div className="flex items-center">
            <AlertCircle className="text-red-400 mr-2" size={20} />
            <div className="flex-1">
              <p className="text-red-700">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600 ml-4"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex space-x-6 p-6 h-full min-w-max">
            {board.columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onAddCard={() => handleAddCard(column.id, column.status, column.title)}
                onEditCard={handleEditCard}
                onDeleteCard={deleteCard}
              />
            ))}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeCard ? (
              <div className="rotate-3 scale-105">
                <KanbanCard
                  card={activeCard}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Modals */}
      <AddCardModal
        isOpen={addCardModal.isOpen}
        onClose={() => setAddCardModal(prev => ({ ...prev, isOpen: false }))}
        onSubmit={handleAddCardSubmit}
        columnStatus={addCardModal.columnStatus}
        columnTitle={addCardModal.columnTitle}
      />

      <EditCardModal
        isOpen={editCardModal.isOpen}
        card={editCardModal.card}
        onClose={() => setEditCardModal({ isOpen: false, card: null })}
        onUpdate={updateCard}
        onDelete={deleteCard}
      />
    </div>
  );
}
