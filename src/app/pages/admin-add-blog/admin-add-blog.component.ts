import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-add-blog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-add-blog.component.html',
  styleUrls: ['./admin-add-blog.component.css'],
})
export class AdminAddBlogComponent {
  blog = {
    title: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    category: '',
    tags: '',
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const payload = {
      ...this.blog,
      tags: this.blog.tags.split(',').map((tag) => tag.trim()),
    };

    this.http
      .post('http://localhost:3000/api/blogs', payload, {
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          alert('Blog created successfully!');
          this.router.navigate(['/blogs']);
        },
        error: (err) => {
          console.error(err);
          alert('Failed to create blog.');
        },
      });
  }
}
