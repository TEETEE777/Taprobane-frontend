import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    NgIf,
    HttpClientModule,
    FormsModule,
    NgFor,
    NgClass,
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  productId!: string;
  product: any;
  quantity: number = 1;
  reviews: any[] = [];
  rating: number = 0;
  comment: string = '';
  userId: string | null = null;
  userEmail: string | null = null;
  loadingReviews: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const productId = params.get('id');
      if (productId) {
        this.productId = productId;
        this.fetchProduct(productId);
        this.fetchReviews(productId);
      }
    });

    const token = this.authService.getDecodedToken();
    this.userId = token?.user?.id || null;
    this.userEmail = token?.user?.email || null;
  }

  fetchProduct(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (data) => (this.product = data),
      error: (err) => console.error('Failed to fetch product:', err),
    });
  }
  getEcoLabel(score: number): string {
    if (score >= 80) return 'Highly Sustainable';
    if (score >= 50) return 'Moderately Sustainable';
    return 'Needs Improvement';
  }

  fetchReviews(id: string) {
    this.loadingReviews = true;
    this.http.get<any[]>(`http://localhost:3000/api/reviews/${id}`).subscribe({
      next: (data) => {
        this.reviews = data;
        this.loadingReviews = false;
      },
      error: (err) => {
        console.error('Failed to fetch reviews:', err);
        this.loadingReviews = false;
      },
    });
  }

  get averageRating(): number {
    if (!this.reviews.length) return 0;
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / this.reviews.length;
  }

  submitReview() {
    if (!this.rating || !this.userId || !this.comment.trim()) {
      alert('Please provide a rating and comment.');
      return;
    }

    const review = {
      productId: this.productId,
      userId: this.userId,
      userEmail: this.userEmail,
      rating: this.rating,
      comment: this.comment,
    };

    this.http.post('http://localhost:3000/api/reviews', review).subscribe({
      next: () => {
        alert('Review submitted successfully!');
        this.rating = 0;
        this.comment = '';
        this.fetchReviews(this.productId); // reload reviews
      },
      error: () => alert('Failed to submit review'),
    });
  }

  addToCart() {
    if (!this.product) return;

    const item: CartItem = {
      productId: this.product._id || this.product.id,
      name: this.product.name,
      price: this.product.price,
      quantity: this.quantity,
      image: this.product.thumbnail || 'assets/placeholder.jpg',
      color: this.product.color, // optional
    };

    this.cartService.addToCart(item);

    alert(`${this.product.name} added to cart!`);

    // Navigate to cart page after adding
    this.router.navigate(['/app-cart']);
  }
}
