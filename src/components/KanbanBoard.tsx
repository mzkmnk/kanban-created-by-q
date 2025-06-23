// Kanbanボードメインコンポーネント

'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Card } from '@/types/kanban';
import { useKanban } from '@/hooks/useKanban';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { AddCardModal } from './AddCardModal';
import { EditCardModal } from './EditCardModal';
import { RefreshCw, AlertCircle } from 'lucide-react';

export const KanbanBoard: React.FC = () => {
  const {
    board,
    loading,
    error,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    refreshBoard,
    clearError,
  } = useKanban();

  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [addCardModal, setAddCardModal] = useState<{
    isOpen: boolean;
    columnId: string;
    columnTitle: string;
  }>({
    isOpen: false,
    columnId: '',
    columnTitle: '',
  });
  const [editCardModal, setEditCardModal] = useState<{
    isOpen: boolean;
    card: Card | null;
  }>({
    isOpen: false,
    card: null,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    
    if (active.data.current?.type === 'card') {
      setActiveCard(active.data.current.card);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // カードを別のカラムに移動
    if (active.data.current?.type === 'card' && over.data.current?.type === 'column') {
      moveCard(activeId, overId);
    }
  };

  const handleAddCard = (columnId: string) => {
    const column = board?.columns.find(col => col.id === columnId);
    if (column) {
      setAddCardModal({
        isOpen: true,
        columnId,
        columnTitle: column.title,
      });
    }
  };

  const handleEditCard = (card: Card) => {
    setEditCardModal({
      isOpen: true,
      card,
    });
  };

  const handleDeleteCard = (cardId: string) => {
    if (window.confirm('このカードを削除しますか？')) {
      deleteCard(cardId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2 text-gray-600">
          <RefreshCw className="animate-spin" size={20} />
          <span>ボードを読み込み中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle size={24} />
          <span className="text-lg font-medium">エラーが発生しました</span>
        </div>
        <p className="text-gray-600 text-center">{error}</p>
        <div className="flex space-x-3">
          <button
            onClick={clearError}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            エラーを閉じる
          </button>
          <button
            onClick={refreshBoard}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-gray-600">ボードが見つかりません</p>
        <button
          onClick={refreshBoard}
          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors"
        >
          ボードを作成
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* ボードヘッダー */}
      <div className="flex items-center justify-between p-6 bg-white border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{board.title}</h1>
          <p className="text-gray-600 text-sm mt-1">
            最終更新: {new Intl.DateTimeFormat('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }).format(board.updatedAt)}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshBoard}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            <RefreshCw size={16} />
            <span>更新</span>
          </button>
        </div>
      </div>

      {/* Kanbanボード */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden bg-gray-50">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex space-x-6 p-6 h-full min-w-max">
            {board.columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onAddCard={handleAddCard}
                onEditCard={handleEditCard}
                onDeleteCard={handleDeleteCard}
              />
            ))}
          </div>

          {/* ドラッグオーバーレイ */}
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

      {/* モーダル */}
      <AddCardModal
        isOpen={addCardModal.isOpen}
        columnTitle={addCardModal.columnTitle}
        onClose={() => setAddCardModal({ isOpen: false, columnId: '', columnTitle: '' })}
        onSubmit={(cardData) => {
          addCard(addCardModal.columnId, cardData);
          setAddCardModal({ isOpen: false, columnId: '', columnTitle: '' });
        }}
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
};
