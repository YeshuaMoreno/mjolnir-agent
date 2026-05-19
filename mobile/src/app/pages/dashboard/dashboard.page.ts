import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit {
  userId: number | null = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userId = this.userService.getCurrentUserId();
    if (!this.userId) {
      this.router.navigate(['/user-select']);
    }
  }

  logout() {
    this.userService.clearUser();
    this.router.navigate(['/user-select']);
  }
}
