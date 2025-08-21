import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { AdminNavbarComponent } from '../../components/admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminNavbarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  stats: any = {};
  users: any[] = [];
  loading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadUsers();
  }

  loadStats() {
    this.adminService.getStats().subscribe({
      next: (res) => (this.stats = res),
      error: (err) => console.error('Failed to fetch stats:', err),
    });
  }

  loadUsers() {
    this.adminService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
      },
      error: (err) => console.error('Failed to fetch users:', err),
    });
  }

  toggleUser(userId: string) {
    this.adminService.toggleUserStatus(userId).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Failed to update user:', err),
    });
  }
}
