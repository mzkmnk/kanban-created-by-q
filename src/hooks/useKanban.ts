'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, CreateTaskInput, UpdateTaskInput, Column } from '@/types/kanban';

const STORAGE_KEY = 'kanban-tasks';

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

export const useKanban = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [isLoading, setIsLoading] = useState(true);

  // ローカルストレージからデータを読み込み
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        const tasks: Task[] = JSON.parse(savedTasks).map((task: Task & { createdAt: string; updatedAt: string }) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        }));

        const updatedColumns = initialColumns.map(column => ({
          ...column,
          tasks: tasks.filter(task => task.status === column.status)
        }));

        setColumns(updatedColumns);
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ローカルストレージにデータを保存
  const saveTasks = useCallback((updatedColumns: Column[]) => {
    try {
      const allTasks = updatedColumns.flatMap(column => column.tasks);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allTasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  }, []);

  // タスクを作成
  const createTask = useCallback((input: CreateTaskInput) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      tags: input.tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setColumns(prevColumns => {
      const updatedColumns = prevColumns.map(column => {
        if (column.status === input.status) {
          return {
            ...column,
            tasks: [...column.tasks, newTask]
          };
        }
        return column;
      });
      saveTasks(updatedColumns);
      return updatedColumns;
    });

    return newTask;
  }, [saveTasks]);

  // タスクを更新
  const updateTask = useCallback((input: UpdateTaskInput) => {
    setColumns(prevColumns => {
      const updatedColumns = prevColumns.map(column => ({
        ...column,
        tasks: column.tasks.map(task => {
          if (task.id === input.id) {
            const updatedTask = {
              ...task,
              ...input,
              updatedAt: new Date()
            };
            return updatedTask;
          }
          return task;
        }).filter(task => task.status === column.status)
      }));

      // ステータスが変更された場合、新しいカラムにタスクを移動
      if (input.status) {
        const taskToMove = prevColumns
          .flatMap(col => col.tasks)
          .find(task => task.id === input.id);

        if (taskToMove && taskToMove.status !== input.status) {
          const movedTask = { ...taskToMove, ...input, updatedAt: new Date() };
          return updatedColumns.map(column => {
            if (column.status === input.status) {
              return {
                ...column,
                tasks: [...column.tasks, movedTask]
              };
            }
            return column;
          });
        }
      }

      saveTasks(updatedColumns);
      return updatedColumns;
    });
  }, [saveTasks]);

  // タスクを削除
  const deleteTask = useCallback((taskId: string) => {
    setColumns(prevColumns => {
      const updatedColumns = prevColumns.map(column => ({
        ...column,
        tasks: column.tasks.filter(task => task.id !== taskId)
      }));
      saveTasks(updatedColumns);
      return updatedColumns;
    });
  }, [saveTasks]);

  // タスクのステータスを変更（ドラッグ&ドロップ用）
  const moveTask = useCallback((taskId: string, newStatus: TaskStatus) => {
    updateTask({ id: taskId, status: newStatus });
  }, [updateTask]);

  // タスクを取得
  const getTask = useCallback((taskId: string): Task | undefined => {
    return columns.flatMap(column => column.tasks).find(task => task.id === taskId);
  }, [columns]);

  // 全タスクを取得
  const getAllTasks = useCallback((): Task[] => {
    return columns.flatMap(column => column.tasks);
  }, [columns]);

  return {
    columns,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    getTask,
    getAllTasks
  };
};
