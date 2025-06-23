// カード編集モーダルコンポーネント

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardFormData } from '@/types/kanban';
import { X, Plus, Tag, Trash2 } from 'lucide-react';

interface EditCardModalProps {
  isOpen: boolean;
  card: Card | null;
  onClose: () => void;
  onUpdate: (cardId: string, cardData: Partial<Card>) => void;
  onDelete: (cardId: string) => void;
}

export const EditCardModal: React.FC<EditCardModalProps> = ({
  isOpen,
  card,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [formData, setFormData] = useState<CardFormData>({
    title: '',
    description: '',
    priority: 'medium',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // カードデータをフォームに設定
  useEffect(() => {
    if (card) {
      setFormData({
        title: card.title,
        description: card.description,
        priority: card.priority,
        tags: card.tags || [],
      });
    }
  }, [card]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!card) return;

    // バリデーション
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '説明は必須です';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onUpdate(card.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        tags: formData.tags,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      tags: [],
    });
    setTagInput('');
    setErrors({});
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleDelete = () => {
    if (card) {
      onDelete(card.id);
      handleClose();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags?.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* モーダルヘッダー */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            カードを編集
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
              title="削除"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 削除確認ダイアログ */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                カードを削除しますか？
              </h3>
              <p className="text-gray-600 mb-4">
                この操作は取り消せません。
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md transition-colors"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        )}

        {/* モーダルボディ */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* カード情報 */}
          <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
            <div className="flex justify-between">
              <span>作成日: {formatDate(card.createdAt)}</span>
              <span>更新日: {formatDate(card.updatedAt)}</span>
            </div>
            <div className="mt-1">
              ステータス: <span className="font-medium">{card.status}</span>
            </div>
          </div>

          {/* タイトル */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              タイトル *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={`
                w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.title ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="カードのタイトルを入力"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* 説明 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              説明 *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className={`
                w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none
                ${errors.description ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="カードの詳細な説明を入力"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* 優先度 */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              優先度
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                priority: e.target.value as 'low' | 'medium' | 'high' 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </div>

          {/* タグ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タグ
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="タグを入力してEnterキー"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            
            {/* タグリスト */}
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                  >
                    <Tag size={12} className="mr-1" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-blue-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ボタン */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors"
            >
              更新
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
