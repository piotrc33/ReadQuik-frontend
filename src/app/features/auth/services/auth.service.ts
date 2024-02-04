import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UserI } from 'src/app/api/model/auth/user.i';
import { LoginDataI } from 'src/app/api/model/auth/login-data.i';
import { jwtDecode } from 'jwt-decode';
import { LoginResponseI } from 'src/app/api/model/auth/login-response.i';
import { JwtDataI } from '../model/jwt-data.i';
import { Router } from '@angular/router';
import { baseUrl } from 'src/app/shared/variables';

@Injectable()
export class AuthService {
  headers = { 'content-type': 'application/json' };

  logout$ = new Subject<void>();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  signup(user: UserI): Observable<UserI> {
    const url: string = `${baseUrl}/signup`;
    return this.http.post<UserI>(url, user, { headers: this.headers });
  }

  login(loginData: LoginDataI): Observable<LoginResponseI> {
    const url: string = `${baseUrl}/login`;
    return this.http.post<LoginResponseI>(url, loginData, { headers: this.headers });
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
