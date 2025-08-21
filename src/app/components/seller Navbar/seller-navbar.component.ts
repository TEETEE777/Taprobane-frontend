import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seller-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './seller-navbar.component.html',
  styleUrls: ['./seller-navbar.component.css'],
})
export class SellerNavbarComponent {
  sellerName = 'Seller';

  constructor(private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.sellerName = payload?.user?.name || 'Seller';
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
