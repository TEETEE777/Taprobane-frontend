// seller-dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerNavbarComponent } from '../../components/seller Navbar/seller-navbar.component';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, SellerNavbarComponent, RouterModule],
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css'],
})
export class SellerDashboardComponent {
  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate(['/' + path]);
  }
}
