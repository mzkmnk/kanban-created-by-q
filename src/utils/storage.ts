/**
 * Local Storage Utilities
 * Worker3 Implementation - Robust error handling and type safety
 */

import { KanbanBoard, KanbanCard, TaskStatus, TaskPriority } from '@/types/kanban';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'kanban-board-worker3';

/**
 * Generate initial demo data for the Kanban board
 */
export function generateInitialData(): KanbanBoard {
  const now = new Date();
  
  const todoCards: KanbanCard[] = [
    {
      id: uuidv4(),
      title: 'Design System Setup',
      description: 'Create a comprehensive design system with reusable components',
      status: 'todo',
      priority: 'high',
      tags: ['design', 'frontend'],
      assignee: 'Designer',
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: 'API Documentation',
      description: 'Write comprehensive API documentation for all endpoints',
      status: 'todo',
      priority: 'medium',
      tags: ['documentation', 'backend'],
      assignee: 'Backend Dev',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: 'User Authentication',
      description: 'Implement secure user authentication with JWT tokens',
      status: 'todo',
      priority: 'urgent',
      tags: ['security', 'backend'],
      assignee: 'Security Engineer',
      dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      createdAt: now,
      updatedAt: now,
    },
  ];

  const inProgressCards: KanbanCard[] = [
    {
      id: uuidv4(),
      title: 'Responsive Layout',
      description: 'Make the application fully responsive across all devices',
      status: 'in-progress',
      priority: 'high',
      tags: ['frontend', 'responsive'],
      assignee: 'Frontend Dev',
      dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: 'Database Migration',
      description: 'Migrate from SQLite to PostgreSQL for production',
      status: 'in-progress',
      priority: 'medium',
      tags: ['database', 'migration'],
      assignee: 'DevOps Engineer',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      updatedAt: now,
    },
  ];

  const doneCards: KanbanCard[] = [
    {
      id: uuidv4(),
      title: 'Project Setup',
      description: 'Initialize Next.js project with TypeScript and Tailwind CSS',
      status: 'done',
      priority: 'high',
      tags: ['setup', 'configuration'],
      assignee: 'Lead Developer',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    },
    {
      id: uuidv4(),
      title: 'Git Repository Setup',
      description: 'Set up Git repository with proper branching strategy',
      status: 'done',
      priority: 'medium',
      tags: ['git', 'setup'],
      assignee: 'Lead Developer',
      createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
  ];

  return {
    id: uuidv4(),
    title: 'Kanban Project Management',
    description: 'A comprehensive project management tool built with Next.js',
    columns: [
      {
        id: 'todo-column',
        title: 'To Do',
        status: 'todo',
        cards: todoCards,
        color: '#ef4444', // red-500
      },
      {
        id: 'in-progress-column',
        title: 'In Progress',
        status: 'in-progress',
        cards: inProgressCards,
        maxCards: 3,
        color: '#f59e0b', // amber-500
      },
      {
        id: 'done-column',
        title: 'Done',
        status: 'done',
        cards: doneCards,
        color: '#10b981', // emerald-500
      },
    ],
    createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: now,
  };
}

/**
 * Load Kanban board data from localStorage
 */
export function loadKanbanBoard(): KanbanBoard | null {
  try {
    if (typeof window === 'undefined') {
      return null; // SSR safety
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);
    
    // Convert date strings back to Date objects
    const board: KanbanBoard = {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      updatedAt: new Date(parsed.updatedAt),
      columns: parsed.columns.map((column: any) => ({
        ...column,
        cards: column.cards.map((card: any) => ({
          ...card,
          createdAt: new Date(card.createdAt),
          updatedAt: new Date(card.updatedAt),
          dueDate: card.dueDate ? new Date(card.dueDate) : undefined,
        })),
      })),
    };

    return board;
  } catch (error) {
    console.error('Failed to load Kanban board from localStorage:', error);
    return null;
  }
}

/**
 * Save Kanban board data to localStorage
 */
export function saveKanbanBoard(board: KanbanBoard): boolean {
  try {
    if (typeof window === 'undefined') {
      return false; // SSR safety
    }

    const serialized = JSON.stringify(board);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.error('Failed to save Kanban board to localStorage:', error);
    return false;
  }
}

/**
 * Clear all Kanban board data from localStorage
 */
export function clearKanbanBoard(): boolean {
  try {
    if (typeof window === 'undefined') {
      return false; // SSR safety
    }

    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear Kanban board from localStorage:', error);
    return false;
  }
}

/**
 * Get priority color for UI display
 */
export function getPriorityColor(priority: TaskPriority): string {
  switch (priority) {
    case 'urgent':
      return '#dc2626'; // red-600
    case 'high':
      return '#ea580c'; // orange-600
    case 'medium':
      return '#ca8a04'; // yellow-600
    case 'low':
      return '#16a34a'; // green-600
    default:
      return '#6b7280'; // gray-500
  }
}

/**
 * Get priority label for UI display
 */
export function getPriorityLabel(priority: TaskPriority): string {
  switch (priority) {
    case 'urgent':
      return 'Urgent';
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
    default:
      return 'Unknown';
  }
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Check if a date is overdue
 */
export function isOverdue(date: Date): boolean {
  return date < new Date();
}

/**
 * Generate a new card ID
 */
export function generateCardId(): string {
  return uuidv4();
}

/**
 * Validate card data
 */
export function validateCardData(data: Partial<KanbanCard>): string[] {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (data.title && data.title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }

  if (data.description && data.description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }

  if (data.priority && !['low', 'medium', 'high', 'urgent'].includes(data.priority)) {
    errors.push('Invalid priority level');
  }

  if (data.status && !['todo', 'in-progress', 'done'].includes(data.status)) {
    errors.push('Invalid status');
  }

  return errors;
}
