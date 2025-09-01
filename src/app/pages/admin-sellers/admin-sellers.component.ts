import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { AdminNavbarComponent } from '../../components/admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-sellers',
  standalone: true,
  imports: [CommonModule, AdminNavbarComponent],
  templateUrl: './admin-sellers.component.html',
  styleUrls: ['./admin-sellers.component.css'],
})
export class AdminSellersComponent implements OnInit {
  sellers: any[] = [];
  loading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadSellers();
  }

  loadSellers() {
    this.adminService.getSellers().subscribe({
      next: (res) => {
        this.sellers = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  approveSeller(sellerId: string) {
    this.adminService.approveSeller(sellerId).subscribe({
      next: () => this.loadSellers(),
      error: (err) => console.error(err),
    });
  }

  rejectSeller(sellerId: string) {
    this.adminService.rejectSeller(sellerId).subscribe({
      next: () => this.loadSellers(),
      error: (err) => console.error(err),
    });
  }

  toggleStatus(sellerId: string, isActive: boolean) {
    this.adminService.toggleSellerStatus(sellerId).subscribe({
      next: () => this.loadSellers(),
      error: (err) => console.error(err),
    });
  }
}
