// Kanbanカードコンポーネント

'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/types/kanban';
import { Edit, Trash2, Clock, Tag } from 'lucide-react';

interface KanbanCardProps {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (cardId: string) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  card,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-300 bg-white';
    }
  };

  const getPriorityText = (priority?: string) => {
    switch (priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        group relative p-4 rounded-lg border-l-4 shadow-sm cursor-grab
        hover:shadow-md transition-all duration-200
        ${getPriorityColor(card.priority)}
        ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}
      `}
    >
      {/* カードヘッダー */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1 mr-2">
          {card.title}
        </h3>
        
        {/* アクションボタン */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(card);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
            title="編集"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
            title="削除"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* カード説明 */}
      {card.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-3">
          {card.description}
        </p>
      )}

      {/* タグ */}
      {card.tags && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {card.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              <Tag size={10} className="mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* カードフッター */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        {/* 優先度 */}
        {card.priority && (
          <span className={`
            px-2 py-1 rounded-full font-medium
            ${card.priority === 'high' ? 'bg-red-100 text-red-700' : ''}
            ${card.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
            ${card.priority === 'low' ? 'bg-green-100 text-green-700' : ''}
          `}>
            {getPriorityText(card.priority)}
          </span>
        )}

        {/* 更新日時 */}
        <div className="flex items-center">
          <Clock size={10} className="mr-1" />
          <span>{formatDate(card.updatedAt)}</span>
        </div>
      </div>

      {/* ドラッグ中のオーバーレイ */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-200 bg-opacity-20 rounded-lg border-2 border-blue-300 border-dashed" />
      )}
    </div>
  );
};
