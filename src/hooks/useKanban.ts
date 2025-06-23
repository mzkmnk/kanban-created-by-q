// Kanban状態管理カスタムフック

import { useState, useEffect, useCallback } from 'react';
import { Board, Card, CardFormData } from '@/types/kanban';
import {
  loadBoardFromStorage,
  saveBoardToStorage,
  generateInitialBoard,
  moveCardBetweenColumns,
  addCardToColumn,
  updateCardInBoard,
  deleteCardFromBoard,
} from '@/utils/storage';

export const useKanban = () => {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初期データの読み込み
  useEffect(() => {
    const initializeBoard = () => {
      try {
        setLoading(true);
        setError(null);

        let loadedBoard = loadBoardFromStorage();
        
        if (!loadedBoard) {
          loadedBoard = generateInitialBoard();
          saveBoardToStorage(loadedBoard);
        }

        setBoard(loadedBoard);
      } catch (err) {
        console.error('Failed to initialize board:', err);
        setError('ボードの初期化に失敗しました');
        
        // エラーが発生した場合は初期データを生成
        const fallbackBoard = generateInitialBoard();
        setBoard(fallbackBoard);
        saveBoardToStorage(fallbackBoard);
      } finally {
        setLoading(false);
      }
    };

    initializeBoard();
  }, []);

  // ボードの保存
  const saveBoard = useCallback((updatedBoard: Board) => {
    try {
      saveBoardToStorage(updatedBoard);
      setBoard(updatedBoard);
      setError(null);
    } catch (err) {
      console.error('Failed to save board:', err);
      setError('ボードの保存に失敗しました');
    }
  }, []);

  // カードの追加
  const addCard = useCallback((columnId: string, cardData: CardFormData) => {
    if (!board) return;

    try {
      const updatedBoard = addCardToColumn(board, columnId, {
        title: cardData.title,
        description: cardData.description,
        priority: cardData.priority,
        tags: cardData.tags,
      });
      
      saveBoard(updatedBoard);
    } catch (err) {
      console.error('Failed to add card:', err);
      setError('カードの追加に失敗しました');
    }
  }, [board, saveBoard]);

  // カードの更新
  const updateCard = useCallback((cardId: string, cardData: Partial<Card>) => {
    if (!board) return;

    try {
      const updatedBoard = updateCardInBoard(board, cardId, cardData);
      saveBoard(updatedBoard);
    } catch (err) {
      console.error('Failed to update card:', err);
      setError('カードの更新に失敗しました');
    }
  }, [board, saveBoard]);

  // カードの削除
  const deleteCard = useCallback((cardId: string) => {
    if (!board) return;

    try {
      const updatedBoard = deleteCardFromBoard(board, cardId);
      saveBoard(updatedBoard);
    } catch (err) {
      console.error('Failed to delete card:', err);
      setError('カードの削除に失敗しました');
    }
  }, [board, saveBoard]);

  // カードの移動
  const moveCard = useCallback((cardId: string, targetColumnId: string) => {
    if (!board) return;

    try {
      const updatedBoard = moveCardBetweenColumns(board, cardId, targetColumnId);
      saveBoard(updatedBoard);
    } catch (err) {
      console.error('Failed to move card:', err);
      setError('カードの移動に失敗しました');
    }
  }, [board, saveBoard]);

  // ボードの再読み込み
  const refreshBoard = useCallback(() => {
    try {
      setLoading(true);
      setError(null);

      const loadedBoard = loadBoardFromStorage();
      if (loadedBoard) {
        setBoard(loadedBoard);
      } else {
        const newBoard = generateInitialBoard();
        setBoard(newBoard);
        saveBoardToStorage(newBoard);
      }
    } catch (err) {
      console.error('Failed to refresh board:', err);
      setError('ボードの再読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  // エラーのクリア
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    board,
    loading,
    error,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    refreshBoard,
    clearError,
  };
};
