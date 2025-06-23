export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export interface KanbanBoard {
  columns: Column[];
}

export interface TaskFormData {
  title: string;
  description: string;
}
