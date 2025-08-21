import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-social-callback',
  template: '<p>Logging you in...</p>',
})
export class SocialCallbackComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      console.error('No token found in URL');
      this.router.navigate(['/app-login']);
      return;
    }

    // Store the token as-is
    localStorage.setItem('token', token);
    console.log('Stored token:', token);

    // Fetch user info from backend
    this.authService.getCurrentUserInfo().subscribe({
      next: (user: any) => {
        if (!user || !user.role) {
          console.error('Invalid user data received');
          this.router.navigate(['/app-login']);
          return;
        }

        // Set current user in service
        this.authService.setCurrentUser(user);

        // Redirect based on role
        if (user.role === 'admin') this.router.navigate(['/admin-dashboard']);
        else if (user.role === 'seller')
          this.router.navigate(['/seller-dashboard']);
        else this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Failed to fetch current user:', err);
        this.router.navigate(['/app-login']);
      },
    });
  }
}
