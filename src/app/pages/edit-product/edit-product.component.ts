import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SellerNavbarComponent } from '../../components/seller Navbar/seller-navbar.component';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule, SellerNavbarComponent],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  productId: string | null = null;
  product: any = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (!this.productId) {
      this.error = 'No product ID provided';
      this.loading = false;
      return;
    }

    this.http
      .get<any>(`http://localhost:3000/api/products/${this.productId}`)
      .subscribe({
        next: (data) => {
          this.product = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to fetch product details';
          this.loading = false;
        },
      });
  }
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string | ArrayBuffer | null;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  updateProduct() {
    if (!this.productId) return;

    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('category', this.product.category);
    formData.append('price', this.product.price);
    formData.append('stock', this.product.stock);
    formData.append('ecoScore', this.product.ecoScore);

    if (this.selectedFile) {
      formData.append('thumbnail', this.selectedFile);
    }

    this.http
      .put(`http://localhost:3000/api/products/${this.productId}`, formData)
      .subscribe({
        next: () => {
          alert('Product updated successfully!');
          this.router.navigate(['/seller-products']);
        },
        error: () => alert('Failed to update product'),
      });
  }

  cancel() {
    this.router.navigate(['/seller-products']);
  }
}
