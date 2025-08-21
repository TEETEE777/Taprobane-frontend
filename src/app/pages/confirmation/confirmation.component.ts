import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
  imports: [CommonModule, NavbarComponent, FooterComponent],
})
export class ConfirmationComponent implements OnInit {
  order: any;
  deliveryFee = 300;
  isBrowser: boolean;

  constructor(
    private orderService: OrderService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Detect if running in browser
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.order = this.orderService.getOrder();

    if (!this.order) {
      // Only alert and redirect if in browser context
      if (this.isBrowser) {
        window.alert('No order found. Redirecting to products.');
      }
      this.router.navigate(['/app-products']);
    }
  }

  goToPayment(method: string): void {
    const orderId = this.order?._id;
    if (!orderId) {
      if (this.isBrowser) {
        window.alert('Order ID not found.');
      }
      return;
    }

    if (method === 'cod') {
      this.orderService.updatePayment(orderId, 'cod', 'pending').subscribe({
        next: () => this.router.navigate(['/app-confirmation-cod']),
        error: () => {
          if (this.isBrowser) {
            alert('Failed to update payment status.');
          }
        },
      });
    } else if (method === 'stripe') {
      this.handleStripeCheckout();
    } else {
      if (this.isBrowser) {
        window.alert('Unsupported payment method.');
      }
    }
  }

  async handleStripeCheckout() {
    if (!this.isBrowser) {
      // Stripe only works in browser context
      return;
    }

    const stripe = await loadStripe(
      'pk_test_51Rfoes2fr8xIrQVO48C4XDi2cQmOMVaJ4x8JZ5Vgf5xl93MziPLOpYUWRZPQpU0hceTlpuYNhNaQWFJpelDMDRIQ00uS0GtkeP'
    );

    this.orderService
      .createStripeSession(this.order.items, this.deliveryFee)
      .subscribe({
        next: async (res: any) => {
          if (res.id && stripe) {
            await stripe.redirectToCheckout({ sessionId: res.id });
          }
        },
        error: (err) => {
          console.error('Stripe session failed', err);
          if (this.isBrowser) {
            window.alert('Payment failed. Try again.');
          }
        },
      });
  }

  getGatewayUrl(method: string): string {
    const gatewayMap = {
      mastercard: 'https://your-payment-gateway.com/mastercard',
      paypal: 'https://your-payment-gateway.com/paypal',
    };
    return gatewayMap[method as keyof typeof gatewayMap] || '';
  }
}
