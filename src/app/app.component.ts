import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UserService, User } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Taprobane';

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.authService.getCurrentUserInfo().subscribe({
        next: (user: User) => {
          this.userService.setCurrentUser(user);
          console.log('User loaded:', user);
        },
        error: (err) => {
          if (err.status === 401) {
            this.authService.logout();
          } else {
            console.error('User info failed to load:', err);
          }
        },
      });
    }
  }
}
