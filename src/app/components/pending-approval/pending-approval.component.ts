import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-pending-approval',
  standalone: true,
  imports: [CommonModule, ButtonModule, HttpClientModule],
  templateUrl: './pending-approval.component.html',
  styleUrls: ['./pending-approval.component.css'],
})
export class PendingApprovalComponent implements OnInit {
  fullName: string = '';
  email: string = '';
  statusMessage: string = '';
  checking: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    // Try to get user info from router state first
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      this.fullName = state['fullName'] || '';
      this.email = state['email'] || '';
      // Save to localStorage so it persists for future checks
      localStorage.setItem(
        'pendingSeller',
        JSON.stringify({ fullName: this.fullName, email: this.email })
      );
    } else {
      // fallback to localStorage
      const pending = JSON.parse(localStorage.getItem('pendingSeller') || '{}');
      this.fullName = pending.fullName || '';
      this.email = pending.email || '';
    }
  }

  goToLogin() {
    localStorage.removeItem('pendingSeller'); // clear saved info
    this.router.navigate(['/app-login']);
  }

  checkApprovalStatus() {
    this.checking = true;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user.id) {
      this.statusMessage = 'User information missing.';
      this.checking = false;
      return;
    }

    this.http
      .get(`http://localhost:3000/api/users/${user.id}/status`)
      .pipe(
        catchError((err) => {
          this.statusMessage = 'Failed to check status. Try again later.';
          this.checking = false;
          return of(null);
        })
      )
      .subscribe((res: any) => {
        this.checking = false;
        if (!res) return;

        if (res.sellerStatus === 'approved') {
          this.statusMessage = `Hello ${this.fullName}, your account has been approved! Redirecting to login...`;
          setTimeout(() => this.goToLogin(), 2000);
        } else if (res.sellerStatus === 'pending') {
          this.statusMessage = `Hello ${this.fullName}, your account is still pending approval.`;
        } else if (res.sellerStatus === 'rejected') {
          this.statusMessage = `Hello ${this.fullName}, your account has been rejected. Please contact support.`;
        }
      });
  }
}
