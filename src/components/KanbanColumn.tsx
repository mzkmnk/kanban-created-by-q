/**
 * Kanban Column Component
 * Worker3 Implementation - Advanced column with capacity limits and visual feedback
 */

"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, AlertCircle } from 'lucide-react';
import { KanbanColumn as KanbanColumnType, KanbanCard as KanbanCardType } from '@/types/kanban';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  column: KanbanColumnType;
  onAddCard: () => void;
  onEditCard: (card: KanbanCardType) => void;
  onDeleteCard: (cardId: string) => void;
}

export function KanbanColumn({ 
  column, 
  onAddCard, 
  onEditCard, 
  onDeleteCard 
}: KanbanColumnProps) {
  const {
    setNodeRef,
    isOver,
    active,
  } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      status: column.status,
    },
  });

  const cardIds = column.cards.map(card => card.id);
  const isAtCapacity = column.maxCards && column.cards.length >= column.maxCards;
  const capacityPercentage = column.maxCards 
    ? Math.round((column.cards.length / column.maxCards) * 100)
    : 0;

  // Check if the dragged item can be dropped in this column
  const canDrop = !isAtCapacity || (active?.data.current?.card?.status === column.status);

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg p-4 min-w-80">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h2 className="font-semibold text-gray-900">{column.title}</h2>
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
            {column.cards.length}
            {column.maxCards && `/${column.maxCards}`}
          </span>
        </div>

        <button
          onClick={onAddCard}
          disabled={isAtCapacity}
          className={`
            p-2 rounded-lg transition-all duration-200
            ${isAtCapacity 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-sm'
            }
          `}
          title={isAtCapacity ? 'Column is at maximum capacity' : 'Add new card'}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Capacity Warning */}
      {column.maxCards && capacityPercentage >= 80 && (
        <div className={`
          mb-3 p-2 rounded-lg text-xs flex items-center
          ${capacityPercentage >= 100 
            ? 'bg-red-100 text-red-700 border border-red-200' 
            : 'bg-amber-100 text-amber-700 border border-amber-200'
          }
        `}>
          <AlertCircle size={12} className="mr-1" />
          {capacityPercentage >= 100 
            ? 'Column is at maximum capacity' 
            : `Column is ${capacityPercentage}% full`
          }
        </div>
      )}

      {/* Capacity Progress Bar */}
      {column.maxCards && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className={`h-1 rounded-full transition-all duration-300 ${
                capacityPercentage >= 100 
                  ? 'bg-red-500' 
                  : capacityPercentage >= 80 
                    ? 'bg-amber-500' 
                    : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 min-h-32 rounded-lg transition-all duration-200
          ${isOver && canDrop 
            ? 'bg-blue-50 border-2 border-dashed border-blue-300' 
            : isOver && !canDrop
              ? 'bg-red-50 border-2 border-dashed border-red-300'
              : 'border-2 border-transparent'
          }
        `}
      >
        {/* Cards Container */}
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-0">
            {column.cards.map((card) => (
              <KanbanCard
                key={card.id}
                card={card}
                onEdit={onEditCard}
                onDelete={onDeleteCard}
              />
            ))}
          </div>
        </SortableContext>

        {/* Empty State */}
        {column.cards.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <Plus size={20} />
            </div>
            <p className="text-sm">No cards yet</p>
            <p className="text-xs">Drag cards here or click + to add</p>
          </div>
        )}

        {/* Drop Feedback */}
        {isOver && (
          <div className={`
            mt-4 p-3 rounded-lg text-center text-sm font-medium
            ${canDrop 
              ? 'bg-blue-100 text-blue-700 border border-blue-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
            }
          `}>
            {canDrop 
              ? `Drop card in ${column.title}` 
              : `Cannot drop - ${column.title} is at capacity`
            }
          </div>
        )}
      </div>

      {/* Column Footer Stats */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-between text-xs text-gray-500">
          <span>
            {column.cards.filter(card => card.priority === 'urgent').length} urgent
          </span>
          <span>
            {column.cards.filter(card => card.dueDate && new Date(card.dueDate) < new Date()).length} overdue
          </span>
        </div>
      </div>
    </div>
  );
}
