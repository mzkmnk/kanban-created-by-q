/**
 * Kanban Board Custom Hook
 * Worker3 Implementation - Centralized state management with robust error handling
 */

"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  KanbanBoard, 
  KanbanCard, 
  TaskStatus, 
  KanbanHookReturn,
  KanbanColumn 
} from '@/types/kanban';
import { 
  loadKanbanBoard, 
  saveKanbanBoard, 
  generateInitialData,
  generateCardId,
  validateCardData
} from '@/utils/storage';

export function useKanban(): KanbanHookReturn {
  const [board, setBoard] = useState<KanbanBoard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize board data
  useEffect(() => {
    const initializeBoard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Try to load from localStorage
        let loadedBoard = loadKanbanBoard();
        
        // If no saved data, create initial data
        if (!loadedBoard) {
          loadedBoard = generateInitialData();
          saveKanbanBoard(loadedBoard);
        }

        setBoard(loadedBoard);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize board';
        setError(errorMessage);
        console.error('Board initialization error:', err);
        
        // Fallback to initial data
        const fallbackBoard = generateInitialData();
        setBoard(fallbackBoard);
      } finally {
        setIsLoading(false);
      }
    };

    initializeBoard();
  }, []);

  // Save board to localStorage whenever it changes
  useEffect(() => {
    if (board && !isLoading) {
      const success = saveKanbanBoard(board);
      if (!success) {
        setError('Failed to save changes to local storage');
      }
    }
  }, [board, isLoading]);

  // Add a new card to a column
  const addCard = useCallback((columnId: string, cardData: Omit<KanbanCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!board) return;

    try {
      // Validate card data
      const validationErrors = validateCardData(cardData);
      if (validationErrors.length > 0) {
        setError(`Validation failed: ${validationErrors.join(', ')}`);
        return;
      }

      const now = new Date();
      const newCard: KanbanCard = {
        ...cardData,
        id: generateCardId(),
        createdAt: now,
        updatedAt: now,
      };

      setBoard(prevBoard => {
        if (!prevBoard) return prevBoard;

        const updatedColumns = prevBoard.columns.map(column => {
          if (column.id === columnId) {
            // Check max cards limit
            if (column.maxCards && column.cards.length >= column.maxCards) {
              setError(`Column "${column.title}" has reached its maximum capacity of ${column.maxCards} cards`);
              return column;
            }

            return {
              ...column,
              cards: [...column.cards, newCard],
            };
          }
          return column;
        });

        return {
          ...prevBoard,
          columns: updatedColumns,
          updatedAt: now,
        };
      });

      setError(null); // Clear any previous errors
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add card';
      setError(errorMessage);
      console.error('Add card error:', err);
    }
  }, [board]);

  // Update an existing card
  const updateCard = useCallback((cardId: string, updates: Partial<KanbanCard>) => {
    if (!board) return;

    try {
      // Validate updates
      const validationErrors = validateCardData(updates);
      if (validationErrors.length > 0) {
        setError(`Validation failed: ${validationErrors.join(', ')}`);
        return;
      }

      const now = new Date();

      setBoard(prevBoard => {
        if (!prevBoard) return prevBoard;

        const updatedColumns = prevBoard.columns.map(column => ({
          ...column,
          cards: column.cards.map(card => 
            card.id === cardId 
              ? { ...card, ...updates, updatedAt: now }
              : card
          ),
        }));

        return {
          ...prevBoard,
          columns: updatedColumns,
          updatedAt: now,
        };
      });

      setError(null); // Clear any previous errors
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update card';
      setError(errorMessage);
      console.error('Update card error:', err);
    }
  }, [board]);

  // Delete a card
  const deleteCard = useCallback((cardId: string) => {
    if (!board) return;

    try {
      const now = new Date();

      setBoard(prevBoard => {
        if (!prevBoard) return prevBoard;

        const updatedColumns = prevBoard.columns.map(column => ({
          ...column,
          cards: column.cards.filter(card => card.id !== cardId),
        }));

        return {
          ...prevBoard,
          columns: updatedColumns,
          updatedAt: now,
        };
      });

      setError(null); // Clear any previous errors
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete card';
      setError(errorMessage);
      console.error('Delete card error:', err);
    }
  }, [board]);

  // Move a card to a different status/column
  const moveCard = useCallback((cardId: string, newStatus: TaskStatus) => {
    if (!board) return;

    try {
      const now = new Date();

      setBoard(prevBoard => {
        if (!prevBoard) return prevBoard;

        // Find the card and its current column
        let cardToMove: KanbanCard | null = null;
        let sourceColumnId: string | null = null;

        for (const column of prevBoard.columns) {
          const card = column.cards.find(c => c.id === cardId);
          if (card) {
            cardToMove = card;
            sourceColumnId = column.id;
            break;
          }
        }

        if (!cardToMove || !sourceColumnId) {
          setError('Card not found');
          return prevBoard;
        }

        // Find the target column
        const targetColumn = prevBoard.columns.find(col => col.status === newStatus);
        if (!targetColumn) {
          setError('Target column not found');
          return prevBoard;
        }

        // Check max cards limit for target column
        if (targetColumn.maxCards && targetColumn.cards.length >= targetColumn.maxCards) {
          setError(`Column "${targetColumn.title}" has reached its maximum capacity of ${targetColumn.maxCards} cards`);
          return prevBoard;
        }

        // Update card status and move it
        const updatedCard = { ...cardToMove, status: newStatus, updatedAt: now };

        const updatedColumns = prevBoard.columns.map(column => {
          if (column.id === sourceColumnId) {
            // Remove card from source column
            return {
              ...column,
              cards: column.cards.filter(card => card.id !== cardId),
            };
          } else if (column.status === newStatus) {
            // Add card to target column
            return {
              ...column,
              cards: [...column.cards, updatedCard],
            };
          }
          return column;
        });

        return {
          ...prevBoard,
          columns: updatedColumns,
          updatedAt: now,
        };
      });

      setError(null); // Clear any previous errors
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to move card';
      setError(errorMessage);
      console.error('Move card error:', err);
    }
  }, [board]);

  // Reorder cards within a column
  const reorderCards = useCallback((columnId: string, cardIds: string[]) => {
    if (!board) return;

    try {
      const now = new Date();

      setBoard(prevBoard => {
        if (!prevBoard) return prevBoard;

        const updatedColumns = prevBoard.columns.map(column => {
          if (column.id === columnId) {
            // Reorder cards based on the provided order
            const reorderedCards = cardIds
              .map(id => column.cards.find(card => card.id === id))
              .filter((card): card is KanbanCard => card !== undefined);

            return {
              ...column,
              cards: reorderedCards,
            };
          }
          return column;
        });

        return {
          ...prevBoard,
          columns: updatedColumns,
          updatedAt: now,
        };
      });

      setError(null); // Clear any previous errors
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder cards';
      setError(errorMessage);
      console.error('Reorder cards error:', err);
    }
  }, [board]);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    board: board || generateInitialData(), // Fallback to initial data
    isLoading,
    error,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    reorderCards,
    clearError,
  };
}
