import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = '/api/products'; // relative URL

  constructor(private http: HttpClient) {}

  // GET: Fetch all products
  getAllProducts(): Observable<any[]> {
    console.log('Calling GET /api/products');
    return this.http.get<any[]>(this.apiUrl);
  }

  // GET: Fetch single product by ID
  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // POST: Add a new product
  createProduct(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // PUT: Update existing product
  updateProduct(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // DELETE: Delete a product
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
