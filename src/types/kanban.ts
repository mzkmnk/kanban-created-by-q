/**
 * Kanban Board Type Definitions
 * Worker3 Implementation - Strict TypeScript approach
 */

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  assignee?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: TaskStatus;
  cards: KanbanCard[];
  maxCards?: number;
  color: string;
}

export interface KanbanBoard {
  id: string;
  title: string;
  description?: string;
  columns: KanbanColumn[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DragEndEvent {
  active: {
    id: string;
    data: {
      current?: {
        type: 'card';
        card: KanbanCard;
      };
    };
  };
  over: {
    id: string;
    data: {
      current?: {
        type: 'column';
        status: TaskStatus;
      };
    };
  } | null;
}

export interface CardFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  tags: string[];
  assignee: string;
  dueDate: string;
}

export interface KanbanState {
  board: KanbanBoard;
  isLoading: boolean;
  error: string | null;
}

export interface KanbanActions {
  addCard: (columnId: string, cardData: Omit<KanbanCard, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCard: (cardId: string, updates: Partial<KanbanCard>) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (cardId: string, newStatus: TaskStatus) => void;
  reorderCards: (columnId: string, cardIds: string[]) => void;
  clearError: () => void;
}

export type KanbanHookReturn = KanbanState & KanbanActions;
