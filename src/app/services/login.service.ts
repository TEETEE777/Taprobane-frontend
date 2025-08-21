import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = '/api/users/login'; // use relative URL
  constructor(private http: HttpClient) {}

  loginUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }
  fetchCurrentUser(): Observable<User> {
    const token = localStorage.getItem('token');
    return this.http.get<User>('http://localhost:3000/api/users/current', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
