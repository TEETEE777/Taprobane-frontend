import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  // Call this method to load cart items from localStorage when safe
  initCart(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('cart');
      const items = saved ? JSON.parse(saved) : [];
      this.cartItemsSubject.next(items);
    }
  }

  private saveCart(items: CartItem[]) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
    this.cartItemsSubject.next(items);
  }
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(item: CartItem) {
    const items = [...this.cartItemsSubject.value];
    const index = items.findIndex((i) => i.productId === item.productId);
    if (index > -1) {
      items[index].quantity += item.quantity;
    } else {
      items.push(item);
    }
    this.saveCart(items);
  }

  removeFromCart(productId: string) {
    const items = this.cartItemsSubject.value.filter(
      (i) => i.productId !== productId
    );
    this.saveCart(items);
  }

  updateQuantity(productId: string, quantity: number) {
    const items = this.cartItemsSubject.value.map((i) =>
      i.productId === productId ? { ...i, quantity } : i
    );
    this.saveCart(items);
  }

  clearCart() {
    this.saveCart([]);
  }
}
