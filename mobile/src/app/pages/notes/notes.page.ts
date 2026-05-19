import { Component, OnInit } from '@angular/core';
import { NoteService } from '../../core/services/note';
import { UserService } from '../../core/services/user';
import { Note } from '../../core/models/note.model';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
  standalone: false,
})
export class NotesPage implements OnInit {
  notes: Note[] = [];
  newTitle = '';
  newContent = '';
  userId!: number;

  constructor(private noteService: NoteService, private userService: UserService) {}

  ngOnInit() {
    this.userId = this.userService.getCurrentUserId()!;
    this.load();
  }

  load() {
    this.noteService.getAll(this.userId).subscribe({ next: (n) => (this.notes = n) });
  }

  create() {
    const title = this.newTitle.trim();
    if (!title) return;
    this.noteService.create({ user_id: this.userId, title, content: this.newContent.trim() || undefined }).subscribe({
      next: (n) => { this.notes.unshift(n); this.newTitle = ''; this.newContent = ''; },
    });
  }

  delete(note: Note) {
    this.noteService.delete(note.id, this.userId).subscribe({
      next: () => (this.notes = this.notes.filter(n => n.id !== note.id)),
    });
  }
}
