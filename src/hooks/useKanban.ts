"use client"

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, CreateTaskInput, UpdateTaskInput, Column, KanbanBoard } from '@/types/kanban';

const STORAGE_KEY = 'kanban-board-data';

// 初期データ
const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    status: TaskStatus.TODO,
    tasks: []
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    status: TaskStatus.IN_PROGRESS,
    tasks: []
  },
  {
    id: 'done',
    title: 'Done',
    status: TaskStatus.DONE,
    tasks: []
  }
];

const initialBoard: KanbanBoard = {
  id: 'main-board',
  title: 'My Kanban Board',
  columns: initialColumns,
  createdAt: new Date(),
  updatedAt: new Date()
};

export function useKanban() {
  const [board, setBoard] = useState<KanbanBoard>(initialBoard);
  const [isLoading, setIsLoading] = useState(true);

  // ローカルストレージからデータを読み込み
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // 日付文字列をDateオブジェクトに変換
        const boardData: KanbanBoard = {
          ...parsedData,
          createdAt: new Date(parsedData.createdAt),
          updatedAt: new Date(parsedData.updatedAt),
          columns: parsedData.columns.map((col: Column) => ({
            ...col,
            tasks: col.tasks.map((task: Task) => ({
              ...task,
              createdAt: new Date(task.createdAt),
              updatedAt: new Date(task.updatedAt)
            }))
          }))
        };
        setBoard(boardData);
      }
    } catch (error) {
      console.error('Failed to load kanban data from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // データをローカルストレージに保存
  const saveToStorage = useCallback((boardData: KanbanBoard) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(boardData));
    } catch (error) {
      console.error('Failed to save kanban data to localStorage:', error);
    }
  }, []);

  // タスクを作成
  const createTask = useCallback((input: CreateTaskInput) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      tags: input.tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setBoard(prevBoard => {
      const updatedBoard = {
        ...prevBoard,
        updatedAt: new Date(),
        columns: prevBoard.columns.map(column => 
          column.status === input.status
            ? { ...column, tasks: [...column.tasks, newTask] }
            : column
        )
      };
      saveToStorage(updatedBoard);
      return updatedBoard;
    });

    return newTask;
  }, [saveToStorage]);

  // タスクを更新
  const updateTask = useCallback((input: UpdateTaskInput) => {
    setBoard(prevBoard => {
      const updatedBoard = {
        ...prevBoard,
        updatedAt: new Date(),
        columns: prevBoard.columns.map(column => ({
          ...column,
          tasks: column.tasks.map(task => 
            task.id === input.id
              ? {
                  ...task,
                  ...input,
                  updatedAt: new Date()
                }
              : task
          ).filter(task => 
            // ステータスが変更された場合、元のカラムからタスクを削除
            input.status && input.status !== column.status 
              ? task.id !== input.id 
              : true
          )
        }))
      };

      // ステータスが変更された場合、新しいカラムにタスクを追加
      if (input.status) {
        const taskToMove = prevBoard.columns
          .flatMap(col => col.tasks)
          .find(task => task.id === input.id);
        
        if (taskToMove) {
          updatedBoard.columns = updatedBoard.columns.map(column =>
            column.status === input.status
              ? {
                  ...column,
                  tasks: [...column.tasks, { ...taskToMove, ...input, updatedAt: new Date() }]
                }
              : column
          );
        }
      }

      saveToStorage(updatedBoard);
      return updatedBoard;
    });
  }, [saveToStorage]);

  // タスクを削除
  const deleteTask = useCallback((taskId: string) => {
    setBoard(prevBoard => {
      const updatedBoard = {
        ...prevBoard,
        updatedAt: new Date(),
        columns: prevBoard.columns.map(column => ({
          ...column,
          tasks: column.tasks.filter(task => task.id !== taskId)
        }))
      };
      saveToStorage(updatedBoard);
      return updatedBoard;
    });
  }, [saveToStorage]);

  // タスクを移動（ドラッグ&ドロップ用）
  const moveTask = useCallback((taskId: string, fromStatus: TaskStatus, toStatus: TaskStatus, newIndex?: number) => {
    setBoard(prevBoard => {
      const taskToMove = prevBoard.columns
        .find(col => col.status === fromStatus)
        ?.tasks.find(task => task.id === taskId);

      if (!taskToMove) return prevBoard;

      const updatedBoard = {
        ...prevBoard,
        updatedAt: new Date(),
        columns: prevBoard.columns.map(column => {
          if (column.status === fromStatus) {
            // 元のカラムからタスクを削除
            return {
              ...column,
              tasks: column.tasks.filter(task => task.id !== taskId)
            };
          } else if (column.status === toStatus) {
            // 新しいカラムにタスクを追加
            const updatedTask = { ...taskToMove, status: toStatus, updatedAt: new Date() };
            const newTasks = [...column.tasks];
            
            if (newIndex !== undefined) {
              newTasks.splice(newIndex, 0, updatedTask);
            } else {
              newTasks.push(updatedTask);
            }
            
            return {
              ...column,
              tasks: newTasks
            };
          }
          return column;
        })
      };

      saveToStorage(updatedBoard);
      return updatedBoard;
    });
  }, [saveToStorage]);

  // 全タスクを取得
  const getAllTasks = useCallback(() => {
    return board.columns.flatMap(column => column.tasks);
  }, [board]);

  // ステータス別タスク数を取得
  const getTaskCounts = useCallback(() => {
    return {
      todo: board.columns.find(col => col.status === TaskStatus.TODO)?.tasks.length || 0,
      inProgress: board.columns.find(col => col.status === TaskStatus.IN_PROGRESS)?.tasks.length || 0,
      done: board.columns.find(col => col.status === TaskStatus.DONE)?.tasks.length || 0,
      total: getAllTasks().length
    };
  }, [board, getAllTasks]);

  return {
    board,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    getAllTasks,
    getTaskCounts
  };
}
