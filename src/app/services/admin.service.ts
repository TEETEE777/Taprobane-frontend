import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/api/admin';
  private sellerUrl = 'http://localhost:3000/api/sellers';

  constructor(private http: HttpClient) {}

  // Dashboard stats
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  // Users
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  toggleUserStatus(userId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/toggle`, {});
  }

  getSellers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.sellerUrl}/`);
  }

  approveSeller(sellerId: string): Observable<any> {
    return this.http.put(`${this.sellerUrl}/${sellerId}/approve`, {});
  }

  rejectSeller(sellerId: string): Observable<any> {
    return this.http.put(`${this.sellerUrl}/${sellerId}/reject`, {});
  }

  toggleSellerStatus(sellerId: string): Observable<any> {
    return this.http.put(`${this.sellerUrl}/${sellerId}/toggle`, {});
  }
}
