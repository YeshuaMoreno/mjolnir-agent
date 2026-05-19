import { Component, OnInit } from '@angular/core';
import { ConversationService } from '../../core/services/conversation';
import { UserService } from '../../core/services/user';
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
  userId!: number;

  constructor(private convService: ConversationService, private userService: UserService) {}

  ngOnInit() {
    this.userId = this.userService.getCurrentUserId()!;
    this.convService.getAll(this.userId).subscribe({ next: (c) => (this.conversations = c) });
  }

  openConversation(conv: Conversation) {
    this.selectedTitle = conv.title;
    this.convService.getMessages(conv.id, this.userId).subscribe({ next: (m) => (this.selectedMessages = m) });
  }

  close() {
    this.selectedMessages = [];
    this.selectedTitle = '';
  }
}
