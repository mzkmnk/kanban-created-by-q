// Kanban関連の型定義

export interface Card {
  id: string;
  title: string;
  description: string;
  status: ColumnStatus;
  createdAt: Date;
  updatedAt: Date;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

export interface Column {
  id: string;
  title: string;
  status: ColumnStatus;
  cards: Card[];
  maxCards?: number;
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
  createdAt: Date;
  updatedAt: Date;
}

export type ColumnStatus = 'todo' | 'in-progress' | 'done';

export interface DragEndEvent {
  active: {
    id: string;
    data: {
      current?: {
        type: string;
        card?: Card;
      };
    };
  };
  over: {
    id: string;
    data: {
      current?: {
        type: string;
        accepts?: string[];
      };
    };
  } | null;
}

export interface CardFormData {
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

export interface KanbanContextType {
  board: Board | null;
  loading: boolean;
  error: string | null;
  addCard: (columnId: string, cardData: CardFormData) => void;
  updateCard: (cardId: string, cardData: Partial<Card>) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (cardId: string, targetColumnId: string) => void;
  refreshBoard: () => void;
}
