import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import * as jwtDecode from 'jwt-decode';
import { HttpClientModule } from '@angular/common/http';

interface DecodedToken {
  user: {
    id: string;
    email: string;
    role: 'admin' | 'seller' | 'buyer';
  };
  exp: number;
  iat: number;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    ToastModule,
    HttpClientModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in the form correctly',
      });
      return;
    }

    const userData = this.loginForm.value;

    this.loginService.loginUser(userData).subscribe({
      next: (response) => {
        const token = response.accessToken;
        if (!token) {
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: 'Invalid token received',
          });
          return;
        }

        // ✅ Store token
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        // ✅ Fetch user from backend
        const user = response.user;
        if (user.id && !user._id) {
          user._id = user.id;
        }
        localStorage.setItem('user', JSON.stringify(user));
        this.authService.setCurrentUser(user);
        this.authService.setCurrentUser(user);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login Successful',
        });

        // ✅ Redirect based on role
        const role = user.role;
        if (role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if (role === 'seller') {
          this.router.navigate(['/seller-dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: error.error.message,
        });
      },
    });
  }

  isFieldInvalid(field: string): boolean {
    return (
      this.loginForm.controls[field].invalid &&
      (this.loginForm.controls[field].dirty ||
        this.loginForm.controls[field].touched)
    );
  }

  navigateToRegister() {
    this.router.navigate(['/app-register']);
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:3000/api/auth/google';
  }

  loginWithFacebook() {
    window.location.href = 'http://localhost:3000/api/auth/facebook';
  }
}
