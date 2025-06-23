/**
 * Kanban Card Component
 * Worker3 Implementation - Rich card with priority, tags, and animations
 */

"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Calendar, 
  User, 
  Edit3, 
  Trash2, 
  Clock,
  AlertTriangle,
  Tag
} from 'lucide-react';
import { KanbanCard as KanbanCardType } from '@/types/kanban';
import { 
  getPriorityColor, 
  getPriorityLabel, 
  formatDate, 
  isOverdue 
} from '@/utils/storage';

interface KanbanCardProps {
  card: KanbanCardType;
  onEdit: (card: KanbanCardType) => void;
  onDelete: (cardId: string) => void;
}

export function KanbanCard({ card, onEdit, onDelete }: KanbanCardProps) {
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

  const priorityColor = getPriorityColor(card.priority);
  const priorityLabel = getPriorityLabel(card.priority);
  const isCardOverdue = card.dueDate && isOverdue(card.dueDate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3
        cursor-grab active:cursor-grabbing
        hover:shadow-md transition-all duration-200
        ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}
        ${isCardOverdue ? 'ring-2 ring-red-200' : ''}
      `}
    >
      {/* Priority Indicator */}
      <div 
        className="w-full h-1 rounded-full mb-3"
        style={{ backgroundColor: priorityColor }}
      />

      {/* Card Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1 mr-2">
          {card.title}
        </h3>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(card);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit card"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete card"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Description */}
      {card.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {card.description}
        </p>
      )}

      {/* Tags */}
      {card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {card.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
            >
              <Tag size={10} className="mr-1" />
              {tag}
            </span>
          ))}
          {card.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-500">
              +{card.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Card Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        {/* Left side - Priority and Assignee */}
        <div className="flex items-center space-x-2">
          {/* Priority Badge */}
          <span
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: priorityColor }}
          >
            {card.priority === 'urgent' && <AlertTriangle size={10} className="mr-1" />}
            {priorityLabel}
          </span>

          {/* Assignee */}
          {card.assignee && (
            <div className="flex items-center">
              <User size={10} className="mr-1" />
              <span className="truncate max-w-16">{card.assignee}</span>
            </div>
          )}
        </div>

        {/* Right side - Due Date */}
        {card.dueDate && (
          <div className={`flex items-center ${isCardOverdue ? 'text-red-600' : ''}`}>
            {isCardOverdue && <Clock size={10} className="mr-1" />}
            <Calendar size={10} className="mr-1" />
            <span>{formatDate(card.dueDate)}</span>
          </div>
        )}
      </div>

      {/* Overdue Warning */}
      {isCardOverdue && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center">
          <AlertTriangle size={12} className="mr-1" />
          Overdue
        </div>
      )}
    </div>
  );
}
