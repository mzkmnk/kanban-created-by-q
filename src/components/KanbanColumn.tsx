// Kanbanカラムコンポーネント

'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column, Card } from '@/types/kanban';
import { KanbanCard } from './KanbanCard';
import { Plus, MoreHorizontal } from 'lucide-react';

interface KanbanColumnProps {
  column: Column;
  onAddCard: (columnId: string) => void;
  onEditCard: (card: Card) => void;
  onDeleteCard: (cardId: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  onAddCard,
  onEditCard,
  onDeleteCard,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      accepts: ['card'],
    },
  });

  const getColumnColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 border-gray-300';
      case 'in-progress':
        return 'bg-blue-100 border-blue-300';
      case 'done':
        return 'bg-green-100 border-green-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getHeaderColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'text-gray-700 bg-gray-200';
      case 'in-progress':
        return 'text-blue-700 bg-blue-200';
      case 'done':
        return 'text-green-700 bg-green-200';
      default:
        return 'text-gray-700 bg-gray-200';
    }
  };

  return (
    <div className={`
      flex flex-col w-80 min-w-80 max-w-80 h-full
      rounded-lg border-2 transition-all duration-200
      ${getColumnColor(column.status)}
      ${isOver ? 'border-blue-400 bg-blue-50' : ''}
    `}>
      {/* カラムヘッダー */}
      <div className={`
        flex items-center justify-between p-4 rounded-t-lg
        ${getHeaderColor(column.status)}
      `}>
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold text-lg">{column.title}</h2>
          <span className="bg-white bg-opacity-70 text-sm px-2 py-1 rounded-full font-medium">
            {column.cards.length}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onAddCard(column.id)}
            className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
            title="カードを追加"
          >
            <Plus size={18} />
          </button>
          <button
            className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
            title="その他のオプション"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* カードリスト */}
      <div
        ref={setNodeRef}
        className="flex-1 p-4 space-y-3 overflow-y-auto min-h-96"
      >
        <SortableContext
          items={column.cards.map(card => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              onEdit={onEditCard}
              onDelete={onDeleteCard}
            />
          ))}
        </SortableContext>

        {/* 空の状態 */}
        {column.cards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-200 flex items-center justify-center">
              <Plus size={24} />
            </div>
            <p className="text-sm text-center">
              カードがありません<br />
              <button
                onClick={() => onAddCard(column.id)}
                className="text-blue-500 hover:text-blue-600 underline mt-1"
              >
                最初のカードを追加
              </button>
            </p>
          </div>
        )}

        {/* ドロップゾーンインジケーター */}
        {isOver && (
          <div className="border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg p-4 text-center text-blue-600">
            ここにカードをドロップ
          </div>
        )}
      </div>

      {/* カラムフッター */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={() => onAddCard(column.id)}
          className="w-full flex items-center justify-center space-x-2 p-2 text-gray-600 hover:text-gray-800 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
        >
          <Plus size={16} />
          <span className="text-sm">カードを追加</span>
        </button>
      </div>
    </div>
  );
};
