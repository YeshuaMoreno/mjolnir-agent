import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NoteService } from '../../core/services/note.service';
import { UserService } from '../../core/services/user.service';
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
  error = '';
  userId!: number;

  constructor(
    private noteService: NoteService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit() {
    const id = this.userService.getCurrentUserId();
    if (!id) { this.router.navigate(['/user-select']); return; }
    this.userId = id;
    this.load();
  }

  load() {
    this.noteService.getAll(this.userId).subscribe({
      next: (n) => (this.notes = n),
      error: () => (this.error = 'No se pudieron cargar las notas.'),
    });
  }

  create() {
    const title = this.newTitle.trim();
    if (!title) return;
    this.error = '';
    this.noteService.create({ user_id: this.userId, title, content: this.newContent.trim() || undefined }).subscribe({
      next: (n) => { this.notes.unshift(n); this.newTitle = ''; this.newContent = ''; },
      error: () => (this.error = 'No se pudo crear la nota.'),
    });
  }

  delete(note: Note) {
    this.noteService.delete(note.id, this.userId).subscribe({
      next: () => (this.notes = this.notes.filter(n => n.id !== note.id)),
      error: () => (this.error = 'No se pudo eliminar la nota.'),
    });
  }
}
