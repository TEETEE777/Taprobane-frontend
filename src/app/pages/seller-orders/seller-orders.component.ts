import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SellerNavbarComponent } from '../../components/seller Navbar/seller-navbar.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-seller-orders',
  standalone: true,
  imports: [CommonModule, SellerNavbarComponent, FormsModule],
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.css'],
})
export class SellerOrdersComponent implements OnInit {
  orders: any[] = [];
  userId: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.authService.getDecodedToken();
    this.userId = token?.user?.id || null;

    if (!this.userId) return;

    this.http
      .get<any[]>(`http://localhost:3000/api/orders/seller/${this.userId}`)
      .subscribe({
        next: (data) => (this.orders = data),
        error: (err) => console.error('Failed to load seller orders:', err),
      });
  }
  toggleDropdown(order: any) {
    order.showDropdown = !order.showDropdown;
  }

  updateShippingStatus(order: any, status: string) {
    order.shippingStatus = status;
    order.showDropdown = false; // close dropdown

    this.http
      .put(`http://localhost:3000/api/orders/${order._id}/shipping-status`, {
        status: order.shippingStatus,
      })
      .subscribe({
        next: () => alert('Shipping status updated!'),
        error: () => alert('Failed to update shipping status'),
      });
  }
}
