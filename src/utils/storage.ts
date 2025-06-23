// ローカルストレージ操作ユーティリティ

import { Board, Card, Column, ColumnStatus } from '@/types/kanban';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'kanban-board';

// 初期データの生成
export const generateInitialBoard = (): Board => {
  const now = new Date();
  
  const todoColumn: Column = {
    id: 'todo',
    title: 'To Do',
    status: 'todo',
    cards: [
      {
        id: uuidv4(),
        title: 'プロジェクト計画の作成',
        description: 'プロジェクトの全体計画を立てて、タスクを整理する',
        status: 'todo',
        priority: 'high',
        tags: ['計画', '重要'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        title: 'デザインモックアップ',
        description: 'UIデザインのモックアップを作成する',
        status: 'todo',
        priority: 'medium',
        tags: ['デザイン', 'UI'],
        createdAt: now,
        updatedAt: now,
      },
    ],
  };

  const inProgressColumn: Column = {
    id: 'in-progress',
    title: 'In Progress',
    status: 'in-progress',
    cards: [
      {
        id: uuidv4(),
        title: 'API設計',
        description: 'RESTful APIの設計と仕様書作成',
        status: 'in-progress',
        priority: 'high',
        tags: ['API', '開発'],
        createdAt: now,
        updatedAt: now,
      },
    ],
  };

  const doneColumn: Column = {
    id: 'done',
    title: 'Done',
    status: 'done',
    cards: [
      {
        id: uuidv4(),
        title: '環境構築',
        description: '開発環境のセットアップ完了',
        status: 'done',
        priority: 'medium',
        tags: ['環境構築', '完了'],
        createdAt: now,
        updatedAt: now,
      },
    ],
  };

  return {
    id: uuidv4(),
    title: 'プロジェクト管理ボード',
    columns: [todoColumn, inProgressColumn, doneColumn],
    createdAt: now,
    updatedAt: now,
  };
};

// ローカルストレージからボードデータを取得
export const loadBoardFromStorage = (): Board | null => {
  try {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    
    // 日付文字列をDateオブジェクトに変換
    const board: Board = {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      updatedAt: new Date(parsed.updatedAt),
      columns: parsed.columns.map((column: any) => ({
        ...column,
        cards: column.cards.map((card: any) => ({
          ...card,
          createdAt: new Date(card.createdAt),
          updatedAt: new Date(card.updatedAt),
        })),
      })),
    };

    return board;
  } catch (error) {
    console.error('Failed to load board from storage:', error);
    return null;
  }
};

// ローカルストレージにボードデータを保存
export const saveBoardToStorage = (board: Board): void => {
  try {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  } catch (error) {
    console.error('Failed to save board to storage:', error);
  }
};

// ボードデータをクリア
export const clearBoardStorage = (): void => {
  try {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear board storage:', error);
  }
};

// カードを別のカラムに移動
export const moveCardBetweenColumns = (
  board: Board,
  cardId: string,
  targetColumnId: string
): Board => {
  const newBoard = { ...board };
  let cardToMove: Card | null = null;
  let sourceColumnIndex = -1;
  let cardIndex = -1;

  // カードを見つけて削除
  for (let i = 0; i < newBoard.columns.length; i++) {
    const column = newBoard.columns[i];
    const foundCardIndex = column.cards.findIndex(card => card.id === cardId);
    
    if (foundCardIndex !== -1) {
      cardToMove = { ...column.cards[foundCardIndex] };
      sourceColumnIndex = i;
      cardIndex = foundCardIndex;
      break;
    }
  }

  if (!cardToMove || sourceColumnIndex === -1) {
    return board; // カードが見つからない場合は元のボードを返す
  }

  // ソースカラムからカードを削除
  newBoard.columns[sourceColumnIndex] = {
    ...newBoard.columns[sourceColumnIndex],
    cards: newBoard.columns[sourceColumnIndex].cards.filter(card => card.id !== cardId),
  };

  // ターゲットカラムにカードを追加
  const targetColumnIndex = newBoard.columns.findIndex(col => col.id === targetColumnId);
  if (targetColumnIndex !== -1) {
    const targetColumn = newBoard.columns[targetColumnIndex];
    cardToMove.status = targetColumn.status;
    cardToMove.updatedAt = new Date();

    newBoard.columns[targetColumnIndex] = {
      ...targetColumn,
      cards: [...targetColumn.cards, cardToMove],
    };
  }

  newBoard.updatedAt = new Date();
  return newBoard;
};

// カードを追加
export const addCardToColumn = (
  board: Board,
  columnId: string,
  cardData: Omit<Card, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Board => {
  const newBoard = { ...board };
  const columnIndex = newBoard.columns.findIndex(col => col.id === columnId);
  
  if (columnIndex === -1) return board;

  const column = newBoard.columns[columnIndex];
  const newCard: Card = {
    ...cardData,
    id: uuidv4(),
    status: column.status,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  newBoard.columns[columnIndex] = {
    ...column,
    cards: [...column.cards, newCard],
  };

  newBoard.updatedAt = new Date();
  return newBoard;
};

// カードを更新
export const updateCardInBoard = (
  board: Board,
  cardId: string,
  updates: Partial<Card>
): Board => {
  const newBoard = { ...board };
  
  for (let i = 0; i < newBoard.columns.length; i++) {
    const column = newBoard.columns[i];
    const cardIndex = column.cards.findIndex(card => card.id === cardId);
    
    if (cardIndex !== -1) {
      const updatedCard = {
        ...column.cards[cardIndex],
        ...updates,
        updatedAt: new Date(),
      };
      
      newBoard.columns[i] = {
        ...column,
        cards: [
          ...column.cards.slice(0, cardIndex),
          updatedCard,
          ...column.cards.slice(cardIndex + 1),
        ],
      };
      break;
    }
  }

  newBoard.updatedAt = new Date();
  return newBoard;
};

// カードを削除
export const deleteCardFromBoard = (board: Board, cardId: string): Board => {
  const newBoard = { ...board };
  
  for (let i = 0; i < newBoard.columns.length; i++) {
    const column = newBoard.columns[i];
    const cardIndex = column.cards.findIndex(card => card.id === cardId);
    
    if (cardIndex !== -1) {
      newBoard.columns[i] = {
        ...column,
        cards: column.cards.filter(card => card.id !== cardId),
      };
      break;
    }
  }

  newBoard.updatedAt = new Date();
  return newBoard;
};
