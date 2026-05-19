import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Task, TaskCreate, TaskUpdate } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private api: ApiService) {}

  getAll(userId: number): Observable<Task[]> {
    return this.api.get<Task[]>('/tasks', { user_id: userId });
  }

  create(payload: TaskCreate): Observable<Task> {
    return this.api.post<Task>('/tasks', payload);
  }

  update(taskId: number, userId: number, payload: TaskUpdate): Observable<Task> {
    return this.api.put<Task>(`/tasks/${taskId}`, payload, { user_id: userId });
  }

  delete(taskId: number, userId: number): Observable<void> {
    return this.api.delete<void>(`/tasks/${taskId}`, { user_id: userId });
  }
}
