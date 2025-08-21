import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdminNavbarComponent } from '../../components/admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-blog-form',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbarComponent],
  templateUrl: './admin-blog-form.component.html',
  styleUrls: ['./admin-blog-form.component.css'],
})
export class AdminBlogFormComponent implements OnInit {
  blogId: string | null = null;
  title = '';
  excerpt = '';
  content = '';
  imageUrl = '';
  category = '';
  tags = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.blogId = this.route.snapshot.paramMap.get('id');
    if (this.blogId) {
      this.http
        .get<any>(`http://localhost:3000/api/blogs/${this.blogId}`)
        .subscribe((blog) => {
          this.title = blog.title;
          this.excerpt = blog.excerpt;
          this.content = blog.content;
          this.imageUrl = blog.imageUrl;
          this.category = blog.category || '';
          this.tags = blog.tags?.join(', ') || '';
        });
    }
  }

  saveBlog() {
    const payload = {
      title: this.title,
      excerpt: this.excerpt,
      content: this.content,
      imageUrl: this.imageUrl,
      category: this.category,
      tags: this.tags.split(',').map((t) => t.trim()),
    };

    const request = this.blogId
      ? this.http.put(`http://localhost:3000/api/blogs/${this.blogId}`, payload)
      : this.http.post(`http://localhost:3000/api/blogs`, payload);

    request.subscribe({
      next: () => {
        alert('Blog saved successfully!');
        this.router.navigate(['/admin/blogs']);
      },
      error: () => alert('Failed to save blog'),
    });
  }
}
