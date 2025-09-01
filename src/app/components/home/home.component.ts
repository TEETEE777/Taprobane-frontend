import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    ButtonModule,
    InputTextModule,
    CardModule,
    CarouselModule,
    HttpClientModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  searchQuery: string = '';

  features = [
    {
      title: 'Sustainable Products',
      description:
        'Carefully curated products designed to reduce carbon footprint.',
      icon: 'assets/Group 3.png',
    },
    {
      title: 'Eco-Friendly Choices',
      description: 'Make ethical choices promoting responsible sourcing.',
      icon: 'assets/Group 4.png',
    },
    {
      title: 'High-Quality Selection',
      description: 'Reliable products meeting stringent quality standards.',
      icon: 'assets/Group 5.png',
    },
    {
      title: 'Sustainable Packaging',
      description: 'Eco-conscious packaging to minimize environmental impact.',
      icon: 'assets/Group 6.png',
    },
  ];

  reviews: any[] = []; // will be filled from backend
  loadingReviews: boolean = false;
  currentSlide = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchReviews();
  }

  fetchReviews() {
    this.loadingReviews = true;
    this.http.get<any[]>('http://localhost:3000/api/reviews/all').subscribe({
      next: (data) => {
        this.reviews = data;
        this.loadingReviews = false;
      },
      error: (err) => {
        console.error('Failed to fetch reviews', err);
        this.loadingReviews = false;
      },
    });
  }

  prevSlide() {
    const slider = document.querySelector('.reviews-slider') as HTMLElement;
    slider.scrollBy({ left: -320, behavior: 'smooth' });
  }

  nextSlide() {
    const slider = document.querySelector('.reviews-slider') as HTMLElement;
    slider.scrollBy({ left: 320, behavior: 'smooth' });
  }

  search() {
    console.log('Searching for:', this.searchQuery);
  }
}
