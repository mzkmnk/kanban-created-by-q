'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus, Column, TaskFormData } from '@/types/kanban';

const STORAGE_KEY = 'kanban-tasks';

const initialColumns: Column[] = [
  {
    id: TaskStatus.TODO,
    title: 'To Do',
    tasks: []
  },
  {
    id: TaskStatus.IN_PROGRESS,
    title: 'In Progress',
    tasks: []
  },
  {
    id: TaskStatus.DONE,
    title: 'Done',
    tasks: []
  }
];

export const useKanban = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  // ローカルストレージからデータを読み込み
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        const tasks: Task[] = JSON.parse(savedTasks).map((task: Task) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        }));
        
        const newColumns = initialColumns.map(column => ({
          ...column,
          tasks: tasks.filter(task => task.status === column.id)
        }));
        
        setColumns(newColumns);
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
    }
  }, []);

  // ローカルストレージにデータを保存
  const saveTasks = (newColumns: Column[]) => {
    try {
      const allTasks = newColumns.flatMap(column => column.tasks);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allTasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  };

  // タスクを追加
  const addTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskData.title,
      description: taskData.description,
      status: TaskStatus.TODO,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newColumns = columns.map(column => 
      column.id === TaskStatus.TODO 
        ? { ...column, tasks: [...column.tasks, newTask] }
        : column
    );

    setColumns(newColumns);
    saveTasks(newColumns);
  };

  // タスクを更新
  const updateTask = (taskId: string, taskData: TaskFormData) => {
    const newColumns = columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              title: taskData.title, 
              description: taskData.description,
              updatedAt: new Date()
            }
          : task
      )
    }));

    setColumns(newColumns);
    saveTasks(newColumns);
  };

  // タスクを削除
  const deleteTask = (taskId: string) => {
    const newColumns = columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => task.id !== taskId)
    }));

    setColumns(newColumns);
    saveTasks(newColumns);
  };

  // タスクのステータスを変更
  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    let taskToMove: Task | null = null;
    
    // タスクを見つけて削除
    const columnsWithoutTask = columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => {
        if (task.id === taskId) {
          taskToMove = { ...task, status: newStatus, updatedAt: new Date() };
          return false;
        }
        return true;
      })
    }));

    // タスクを新しいカラムに追加
    if (taskToMove) {
      const newColumns = columnsWithoutTask.map(column => 
        column.id === newStatus 
          ? { ...column, tasks: [...column.tasks, taskToMove!] }
          : column
      );

      setColumns(newColumns);
      saveTasks(newColumns);
    }
  };

  // タスクを取得
  const getTask = (taskId: string): Task | undefined => {
    for (const column of columns) {
      const task = column.tasks.find(task => task.id === taskId);
      if (task) return task;
    }
    return undefined;
  };

  return {
    columns,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTask
  };
};
