import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { Conversation } from '../models/conversation.model';
import { Message } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class ConversationService {
  constructor(private api: ApiService) {}

  getAll(userId: number): Observable<Conversation[]> {
    return this.api.get<Conversation[]>('/conversations', { user_id: userId });
  }

  getMessages(conversationId: number, userId: number): Observable<Message[]> {
    return this.api.get<Message[]>(`/conversations/${conversationId}/messages`, { user_id: userId });
  }
}
