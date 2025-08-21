import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-blog-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-blog-list.component.html',
  styleUrls: ['./admin-blog-list.component.css'],
})
export class AdminBlogListComponent implements OnInit {
  blogs: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs() {
    this.http.get<any[]>('http://localhost:3000/api/blogs').subscribe({
      next: (data) => (this.blogs = data),
      error: (err) => console.error('Failed to fetch blogs:', err),
    });
  }

  createBlog() {
    this.router.navigate(['/admin/blogs/new']);
  }

  editBlog(id: string) {
    this.router.navigate([`/admin/blogs/edit/${id}`]);
  }

  deleteBlog(id: string) {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    this.http.delete(`http://localhost:3000/api/blogs/${id}`).subscribe({
      next: () => {
        alert('Blog deleted');
        this.loadBlogs();
      },
      error: () => alert('Failed to delete blog'),
    });
  }
}
