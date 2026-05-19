import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../core/services/task';
import { UserService } from '../../core/services/user';
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
  userId!: number;

  constructor(private taskService: TaskService, private userService: UserService) {}

  ngOnInit() {
    this.userId = this.userService.getCurrentUserId()!;
    this.load();
  }

  load() {
    this.taskService.getAll(this.userId).subscribe({ next: (t) => (this.tasks = t) });
  }

  create() {
    const title = this.newTitle.trim();
    if (!title) return;
    this.taskService.create({ user_id: this.userId, title }).subscribe({
      next: (t) => { this.tasks.unshift(t); this.newTitle = ''; },
    });
  }

  toggleStatus(task: Task) {
    const status = task.status === 'done' ? 'pending' : 'done';
    this.taskService.update(task.id, this.userId, { status }).subscribe({
      next: (updated) => { const i = this.tasks.findIndex(t => t.id === task.id); if (i > -1) this.tasks[i] = updated; },
    });
  }

  delete(task: Task) {
    this.taskService.delete(task.id, this.userId).subscribe({
      next: () => (this.tasks = this.tasks.filter(t => t.id !== task.id)),
    });
  }
}
