import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ChatService } from '../../core/services/chat';
import { UserService } from '../../core/services/user';
import { Message } from '../../core/models/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: false,
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;

  messages: Message[] = [];
  input = '';
  conversationId: number | null = null;
  sending = false;
  userId!: number;

  constructor(private chatService: ChatService, private userService: UserService) {}

  ngOnInit() {
    this.userId = this.userService.getCurrentUserId()!;
  }

  send() {
    const text = this.input.trim();
    if (!text || this.sending) return;

    this.messages.push({ id: 0, conversation_id: 0, role: 'user', content: text, created_at: new Date().toISOString() });
    this.input = '';
    this.sending = true;

    this.chatService.send({ user_id: this.userId, message: text, conversation_id: this.conversationId }).subscribe({
      next: (res) => {
        this.conversationId = res.conversation_id;
        this.messages.push({ id: 0, conversation_id: res.conversation_id, role: 'assistant', content: res.reply, created_at: new Date().toISOString() });
        this.sending = false;
        setTimeout(() => this.content.scrollToBottom(200), 50);
      },
      error: () => {
        this.messages.push({ id: 0, conversation_id: 0, role: 'assistant', content: 'Error al conectar con MJÖLNIR.', created_at: new Date().toISOString() });
        this.sending = false;
      },
    });
  }

  trackByIndex(index: number) {
    return index;
  }
}
