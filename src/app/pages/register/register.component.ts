import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../services/register.service';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RecaptchaModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  role = 'buyer';

  constructor(
    private registerService: RegisterService,
    private router: Router
  ) {
    console.log('RegisterComponent loaded');
  } // Inject the Router service

  register() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!this.captchaToken) {
      alert('Please complete the captcha');
      return;
    }

    const userData = {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      role: this.role,
      captchaToken: this.captchaToken,
    };

    this.registerService.registerUser(userData).subscribe(
      (response) => {
        if (this.role === 'seller') {
          // Redirect sellers to Pending Approval page
          this.router.navigate(['/pending-approval'], {
            state: { fullName: this.fullName, email: this.email },
          });
        } else {
          // Buyers/Admins go to login
          this.router.navigate(['/app-login']);
        }
      },
      () => {
        alert('Error registering user');
      }
    );
  }
  navigateToLogin() {
    this.router.navigate(['/app-login']);
  }
  loginWithGoogle() {
    window.location.href = 'http://localhost:3000/api/auth/google';
  }

  loginWithFacebook() {
    window.location.href = 'http://localhost:3000/api/auth/facebook';
  }
  captchaResolved: boolean = false;
  captchaToken: string | null = null;

  onCaptchaResolved(token: string | null) {
    this.captchaResolved = !!token;
    this.captchaToken = token;
  }
}
