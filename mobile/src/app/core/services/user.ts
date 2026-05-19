import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { User, UserCreate } from '../models/user.model';

const USER_KEY = 'mjolnir_user_id';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private api: ApiService) {}

  getAll(): Observable<User[]> {
    return this.api.get<User[]>('/users');
  }

  getById(id: number): Observable<User> {
    return this.api.get<User>(`/users/${id}`);
  }

  create(payload: UserCreate): Observable<User> {
    return this.api.post<User>('/users', payload);
  }

  selectUser(id: number): void {
    localStorage.setItem(USER_KEY, String(id));
  }

  getCurrentUserId(): number | null {
    const v = localStorage.getItem(USER_KEY);
    return v ? Number(v) : null;
  }

  clearUser(): void {
    localStorage.removeItem(USER_KEY);
  }
}
