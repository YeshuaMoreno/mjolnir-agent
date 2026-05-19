import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Note, NoteCreate, NoteUpdate } from '../models/note.model';

@Injectable({ providedIn: 'root' })
export class NoteService {
  constructor(private api: ApiService) {}

  getAll(userId: number): Observable<Note[]> {
    return this.api.get<Note[]>('/notes', { user_id: userId });
  }

  create(payload: NoteCreate): Observable<Note> {
    return this.api.post<Note>('/notes', payload);
  }

  update(noteId: number, userId: number, payload: NoteUpdate): Observable<Note> {
    return this.api.put<Note>(`/notes/${noteId}`, payload, { user_id: userId });
  }

  delete(noteId: number, userId: number): Observable<void> {
    return this.api.delete<void>(`/notes/${noteId}`, { user_id: userId });
  }
}
