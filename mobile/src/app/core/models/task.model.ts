export interface Task {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  status: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  user_id: number;
  title: string;
  description?: string;
  status?: string;
  due_date?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: string;
  due_date?: string;
}
