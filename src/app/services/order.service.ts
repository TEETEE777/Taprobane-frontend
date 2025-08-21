import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Order {
  _id: string;
  items: {
    name: string;
    image: string;
    color?: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  delivery: {
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    phone: string;
    notes?: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) {}

  private orderData: any;

  setOrder(order: any) {
    this.orderData = order;
    localStorage.setItem('order', JSON.stringify(order));
  }

  getOrder(): any {
    if (typeof window === 'undefined') return null;
    if (this.orderData) return this.orderData;
    const stored = localStorage.getItem('order');
    return stored ? JSON.parse(stored) : null;
  }
  placeOrder(orderData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, orderData);
  }
  getOrdersByUser(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(
      `http://localhost:3000/api/orders/user/${userId}`
    );
  }

  updatePayment(orderId: string, method: string, status: string) {
    return this.http.put(`${this.apiUrl}/${orderId}/payment`, {
      paymentMethod: method,
      paymentStatus: status,
    });
  }
  createStripeSession(items: any[], deliveryFee: number) {
    const backendUrl = 'http://localhost:3000';
    const itemsWithFullImages = items.map((item) => ({
      ...item,
      image: item.image.startsWith('http')
        ? item.image
        : `${backendUrl}${item.image.startsWith('/') ? '' : '/'}${item.image}`,
    }));
    return this.http.post(
      'http://localhost:3000/api/stripe/create-checkout-session',
      {
        items,
        deliveryFee,
        successUrl: 'http://localhost:4200/app-confirmation-stripe',
        cancelUrl: 'http://localhost:4200/app-cart',
      }
    );
  }
}
