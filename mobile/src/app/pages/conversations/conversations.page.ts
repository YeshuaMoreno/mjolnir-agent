import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConversationService } from '../../core/services/conversation.service';
import { UserService } from '../../core/services/user.service';
import { Conversation } from '../../core/models/conversation.model';
import { Message } from '../../core/models/message.model';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.page.html',
  styleUrls: ['./conversations.page.scss'],
  standalone: false,
})
export class ConversationsPage implements OnInit {
  conversations: Conversation[] = [];
  selectedMessages: Message[] = [];
  selectedTitle = '';
  error = '';
  userId!: number;

  constructor(
    private convService: ConversationService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit() {
    const id = this.userService.getCurrentUserId();
    if (!id) { this.router.navigate(['/user-select']); return; }
    this.userId = id;
    this.convService.getAll(this.userId).subscribe({
      next: (c) => (this.conversations = c),
      error: () => (this.error = 'No se pudieron cargar las conversaciones.'),
    });
  }

  openConversation(conv: Conversation) {
    this.error = '';
    this.selectedTitle = conv.title;
    this.convService.getMessages(conv.id, this.userId).subscribe({
      next: (m) => (this.selectedMessages = m),
      error: () => (this.error = 'No se pudieron cargar los mensajes.'),
    });
  }

  close() {
    this.selectedMessages = [];
    this.selectedTitle = '';
    this.error = '';
  }
}
