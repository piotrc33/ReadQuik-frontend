import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserI } from 'src/app/api/model/auth/user.i';
import { LoginDataI } from 'src/app/api/model/auth/login-data.i';
import { jwtDecode } from 'jwt-decode';
import { LoginResponseI } from 'src/app/api/model/auth/login-response.i';
import { JwtDataI } from '../model/jwt-data.i';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  headers = { 'content-type': 'application/json' };

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  signup(user: UserI): Observable<UserI> {
    const url: string = 'http://localhost:3002/signup';
    const body: string = JSON.stringify(user);

    return this.http.post<UserI>(url, body, { headers: this.headers });
  }

  login(loginData: LoginDataI): Observable<LoginResponseI> {
    const url: string = 'http://localhost:3002/login';
    const body: string = JSON.stringify(loginData);

    return this.http.post<LoginResponseI>(url, body, { headers: this.headers });
  }

  getUsername(): string {
    return (jwtDecode(this.getToken() || '') as JwtDataI).username;
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }
}
