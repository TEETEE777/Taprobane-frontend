import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SellerNavbarComponent } from '../../components/seller Navbar/seller-navbar.component';

@Component({
  selector: 'app-seller-add-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    SellerNavbarComponent,
  ],
  providers: [MessageService],
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css'],
})
export class SellerAddProductComponent {
  productForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      stock: ['', Validators.required],
      materialType: ['', Validators.required],
      packagingType: ['', Validators.required],
      carbonSource: ['', Validators.required],
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    if (this.productForm.invalid || !this.selectedFile) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all fields and upload a product image.',
      });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    const sellerId = JSON.parse(atob(token.split('.')[1])).user.id;

    const imageFormData = new FormData();
    imageFormData.append('image', this.selectedFile); // key must match upload.single("image")

    // Step 1: Upload image first
    this.http
      .post<{ imageUrl: string }>(
        'http://localhost:3000/api/upload',
        imageFormData
      )
      .subscribe({
        next: (uploadRes) => {
          const payload = {
            ...this.productForm.value,
            thumbnail: uploadRes.imageUrl, // ✅ URL string from upload response
            sellerId,
          };

          // Step 2: Now submit product data with image URL
          this.http
            .post('http://localhost:3000/api/products', payload)
            .subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Product added successfully!',
                });
                this.router.navigate(['/seller-dashboard']);
              },
              error: () => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to add product.',
                });
              },
            });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Upload Failed',
            detail: 'Image upload failed. Try again.',
          });
        },
      });
  }
}
