import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-select',
  templateUrl: './user-select.page.html',
  styleUrls: ['./user-select.page.scss'],
  standalone: false,
})
export class UserSelectPage implements OnInit {
  users: User[] = [];
  newUsername = '';
  newEmail = '';
  error = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (users) => (this.users = users),
      error: () => (this.error = 'No se pudo conectar con el backend.'),
    });
  }

  select(user: User) {
    this.userService.selectUser(user.id);
    this.router.navigate(['/dashboard']);
  }

  createAndSelect() {
    if (!this.newUsername.trim() || !this.newEmail.trim()) return;
    this.userService.create({ username: this.newUsername.trim(), email: this.newEmail.trim() }).subscribe({
      next: (user) => {
        this.userService.selectUser(user.id);
        this.router.navigate(['/dashboard']);
      },
      error: () => (this.error = 'No se pudo crear el usuario. ¿Email o username ya existe?'),
    });
  }
}
