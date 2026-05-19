import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../core/services/task.service';
import { UserService } from '../../core/services/user.service';
import { Task } from '../../core/models/task.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: false,
})
export class TasksPage implements OnInit {
  tasks: Task[] = [];
  newTitle = '';
  error = '';
  userId!: number;

  constructor(
    private taskService: TaskService,
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
    this.taskService.getAll(this.userId).subscribe({
      next: (t) => (this.tasks = t),
      error: () => (this.error = 'No se pudieron cargar las tareas.'),
    });
  }

  create() {
    const title = this.newTitle.trim();
    if (!title) return;
    this.error = '';
    this.taskService.create({ user_id: this.userId, title }).subscribe({
      next: (t) => { this.tasks.unshift(t); this.newTitle = ''; },
      error: () => (this.error = 'No se pudo crear la tarea.'),
    });
  }

  toggleStatus(task: Task) {
    const status = task.status === 'done' ? 'pending' : 'done';
    this.taskService.update(task.id, this.userId, { status }).subscribe({
      next: (updated) => {
        const i = this.tasks.findIndex(t => t.id === task.id);
        if (i > -1) this.tasks[i] = updated;
      },
      error: () => (this.error = 'No se pudo actualizar la tarea.'),
    });
  }

  delete(task: Task) {
    this.taskService.delete(task.id, this.userId).subscribe({
      next: () => (this.tasks = this.tasks.filter(t => t.id !== task.id)),
      error: () => (this.error = 'No se pudo eliminar la tarea.'),
    });
  }
}
