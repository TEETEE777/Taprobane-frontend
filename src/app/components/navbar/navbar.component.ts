import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {} // Inject the Router service
  ngOnInit() {
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  // Method to handle the button click
  onLoginClick() {
    this.router.navigate(['/app-login']); // Navigate programmatically
  }

  onRegisterClick() {
    this.router.navigate(['/app-register']); // Navigate programmatically
  }
  onLogoutClick() {
    this.authService.logout();
    this.userService.clearUser();
  }
}
