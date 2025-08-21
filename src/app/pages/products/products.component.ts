import { Component, OnInit } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { CartService, CartItem } from '../../services/cart.service';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    NgFor,
    NgClass,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ToastModule,
    NavbarComponent,
    FooterComponent,
    HttpClientModule,
  ],
  providers: [MessageService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  searchQuery: string = '';
  cartCount = 0;
  products: any[] = [];

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private router: Router,
    private cartService: CartService
  ) {}

  selectedEcoScore: string = '';
  selectedMaterial: string = '';
  maxPrice: number = 5000;

  ngOnInit(): void {
    console.log('ProductsComponent INIT');
    this.productService.getAllProducts().subscribe({
      next: (data) => (this.products = data),
      error: (err) => {
        console.error('Error loading products:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to Load Products',
          detail: err.message,
        });
      },
    });
  }

  get filteredProducts() {
    return this.products.filter((product) => {
      const matchesSearch =
        !this.searchQuery.trim() ||
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesEcoScore =
        !this.selectedEcoScore ||
        product.ecoScore >= Number(this.selectedEcoScore);

      const matchesMaterial =
        !this.selectedMaterial ||
        product.materialType?.toLowerCase() ===
          this.selectedMaterial.toLowerCase();

      const matchesPrice = product.price <= this.maxPrice;

      return (
        matchesSearch && matchesEcoScore && matchesMaterial && matchesPrice
      );
    });
  }

  addToCart(product: any) {
    // Create a CartItem
    const item: CartItem = {
      productId: product._id || product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.thumbnail || 'assets/placeholder.jpg',
      color: product.color, // optional, if available
    };

    // Add to cart via service
    this.cartService.addToCart(item);

    // Optional: update count (you could also subscribe to cart observable)
    this.cartCount++;

    this.messageService.add({
      severity: 'success',
      summary: 'Added to Cart',
      detail: `${product.name} has been added!`,
    });
  }
  getEcoLabel(score: number): string {
    if (score >= 80) return 'Highly Sustainable';
    if (score >= 50) return 'Moderately Sustainable';
    return 'Needs Improvement';
  }

  buyNow(product: any) {
    this.messageService.add({
      severity: 'info',
      summary: 'Buy Now',
      detail: `Proceeding to buy ${product.name}`,
    });

    this.router.navigate(['/app-product', product._id]); // use _id from MongoDB
  }

  scrollToProducts() {
    const section = document.querySelector('.products');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  }
}
