import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'seller' | 'buyer';
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();

  setCurrentUser(user: User | null) {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  getUser(): any {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserId(): string | null {
    const user = this.getUser();
    return user && /^[0-9a-fA-F]{24}$/.test(user._id) ? user._id : null;
  }

  clearUser() {
    this.currentUserSubject.next(null);
  }
}
