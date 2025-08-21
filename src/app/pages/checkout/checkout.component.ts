import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CartService, CartItem } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    InputTextareaModule,
    NavbarComponent,
    FooterComponent,
  ],
})
export class CheckoutComponent implements OnInit {
  checkoutForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    notes: [''],
  });

  cartItems: CartItem[] = [];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router,
    private http: HttpClient,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
  }

  get total() {
    return this.cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }

  isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user._id; // Ensure this comes from login response

      const orderData = {
        items: this.cartItems,
        delivery: this.checkoutForm.value,
        total: this.total,
        deliveryFee: 300,
        userId: userId,
      };
      console.log('Sending orderData:', orderData);
      this.orderService.placeOrder(orderData).subscribe({
        next: (response) => {
          console.log('Order placed:', response);
          this.orderService.setOrder(response);
          this.cartService.clearCart();
          this.router.navigate(['/app-confirmation']);
        },
        error: (err) => {
          console.error('Order failed:', err);
          alert('Order placement failed. Please try again.');
        },
      });
    }
  }
  goBackToCart() {
    this.router.navigate(['/app-cart']);
  }
}
