import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FooterComponent, NavbarComponent, CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  constructor(
    private cartService: CartService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cartService.initCart();
      this.cartService.cartItems$.subscribe((items) => {
        this.cartItems = items;
      });
    }
  }

  loadCart(): void {
    if (typeof localStorage !== 'undefined') {
      const data = localStorage.getItem('cart');
      this.cartItems = data ? JSON.parse(data) : [];
    } else {
      this.cartItems = [];
    }
  }
  private saveCart(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
  }

  get total() {
    return this.cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) return; // optional validation
    this.cartService.updateQuantity(productId, quantity);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  onCheckoutClick() {
    this.router.navigate(['/app-checkout']);
  }

  onContinueClick() {
    this.router.navigate(['/app-products']);
  }
}
