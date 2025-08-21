import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { OrderService } from '../../services/order.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-confirmation-success',
  standalone: true,
  templateUrl: './confirmation-success.component.html',
  styleUrls: ['./confirmation-success.component.css'],
  imports: [CommonModule, NavbarComponent, FooterComponent],
})
export class ConfirmationSuccessComponent implements OnInit {
  order: any;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.order = this.orderService.getOrder();
    if (!this.order) {
      alert('No order found. Redirecting...');
      this.router.navigate(['/app-products']);
      return;
    }
    this.orderService
      .updatePayment(this.order._id, 'stripe', 'paid')
      .subscribe({
        next: () => console.log('Payment status updated.'),
        error: () => console.warn('Payment update failed.'),
      });
  }
}
