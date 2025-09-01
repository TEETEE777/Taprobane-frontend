import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SellerNavbarComponent } from '../../components/seller Navbar/seller-navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-seller-my-products',
  standalone: true,
  imports: [CommonModule, SellerNavbarComponent, FooterComponent, RouterModule],
  templateUrl: './seller-my-products.component.html',
  styleUrls: ['./seller-my-products.component.css'],
})
export class SellerMyProductsComponent implements OnInit {
  products: any[] = [];
  userId: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  loading = true;
  ngOnInit(): void {
    const token = this.authService.getDecodedToken();
    this.userId = token?.user?.id || null;

    if (this.userId) {
      this.http
        .get<any[]>(`http://localhost:3000/api/products/seller/${this.userId}`)
        .subscribe({
          next: (data) => {
            this.products = data;
            this.loading = false;
          },
          error: (err) => {
            console.error('Error fetching seller products', err);
            this.loading = false;
          },
        });
    }
  }

  deleteProduct(productId: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.http
        .delete(`http://localhost:3000/api/products/${productId}`)
        .subscribe({
          next: () => {
            this.products = this.products.filter((p) => p._id !== productId);
          },
          error: () => alert('Failed to delete product'),
        });
    }
  }
  goToEdit(productId: string) {
    this.router.navigate(['/edit-product', productId]);
  }
}
