import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

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
    ButtonModule, // PrimeNG Button
    InputTextModule, // PrimeNG Input
    CardModule, // PrimeNG Cards
    CarouselModule, // PrimeNG Carousel
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
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

  reviews = [
    {
      name: 'Sarah Johnson',
      comment: 'I absolutely love my organic cotton tote bag from Taprobane!',
      rating: 5,
      image: 'assets/sarah.png',
    },
    {
      name: 'Mark Anderson',
      comment: 'Amazing bamboo toothbrushes!',
      rating: 4,
      image: 'assets/mark.png',
    },
    {
      name: 'Emily Lee',
      comment: 'Hemp backpack is fantastic!',
      rating: 5,
      image: 'assets/emily.png',
    },
    {
      name: 'Alex Green',
      comment: 'Eco-friendly products changed my life!',
      rating: 4,
      image: 'assets/mark.png',
    },
  ];

  /* Slider Logic */
  currentSlide = 0;

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
    // Implement search functionality later
  }
}
