import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { ChatRequest, ChatResponse } from '../models/chat.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private api: ApiService) {}

  send(request: ChatRequest): Observable<ChatResponse> {
    return this.api.post<ChatResponse>('/chat', request);
  }
}
