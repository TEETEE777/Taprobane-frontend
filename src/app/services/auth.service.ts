import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService, User } from './user.service';

interface DecodedToken {
  user: {
    id: string;
    email: string;
    role: 'admin' | 'seller' | 'buyer';
  };
  exp: number;
  iat: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) {}
  setCurrentUser(user: User) {
    this.userService.setCurrentUser(user);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }

  getUserRole(): string | null {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return null;

    try {
      const decoded: any = JSON.parse(atob(token.split('.')[1]));
      return decoded.user?.role || null;
    } catch {
      return null;
    }
  }
  getUserEmail(): string | null {
    return this.getDecodedToken()?.user?.email || null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUserInfo(): Observable<User> {
    // Use relative URL here to benefit from proxy config
    return this.http.get<User>('http://localhost:3000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${this.getToken() || ''}`,
      },
    });
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/app-login']);
  }
}
