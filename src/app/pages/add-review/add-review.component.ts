import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';

interface Review {
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css'],
})
export class AddReviewComponent implements OnInit {
  @Input() productId: string = '';

  userEmail: string = '';
  rating: number = 5;
  comment: string = '';
  reviews: Review[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchReviews();
  }

  setRating(value: number) {
    this.rating = value;
  }

  fetchReviews() {
    if (!this.productId) return;
    this.http
      .get<Review[]>(`http://localhost:3000/api/reviews/${this.productId}`)
      .subscribe({
        next: (res) => (this.reviews = res),
        error: (err) => console.error('Failed to fetch reviews', err),
      });
  }

  submitReview() {
    if (!this.userEmail || !this.comment) {
      alert('Please fill in all fields.');
      return;
    }

    // Get logged-in user info
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user._id) {
      alert('You must be logged in to submit a review.');
      return;
    }

    const body = {
      productId: this.productId,
      userId: user._id, // real logged-in user ID
      userEmail: user.email, // or use this.userEmail if you still want input
      rating: this.rating,
      comment: this.comment,
    };

    this.http.post('http://localhost:3000/api/reviews', body).subscribe({
      next: () => {
        alert('Review submitted!');
        this.comment = '';
        this.rating = 5;
        this.fetchReviews();
      },
      error: (err) => console.error('Failed to submit review', err),
    });
  }
}
