import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SellerService {
  private apiUrl = 'http://localhost:3000/api/seller-dashboard';

  constructor(private http: HttpClient) {}

  // Seller summary stats
  getSellerSummary(sellerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/summary/${sellerId}`);
  }

  // Export report as CSV
  exportSellerReport(sellerId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/report/${sellerId}`, {
      responseType: 'blob',
    });
  }
  getRecentOrders(sellerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recent-orders/${sellerId}`);
  }
}
