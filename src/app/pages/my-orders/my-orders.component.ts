import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  userId: string = ''; // Replace this later with real user ID

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userId = this.userService.getUserId();

    if (!userId) {
      console.warn('User not found or invalid. Cannot load orders.');
      return;
    }

    this.orderService.getOrdersByUser(userId).subscribe({
      next: (orders) => (this.orders = orders),
      error: (err) =>
        console.error('Failed to load orders:', err?.error || err),
    });
  }
}
