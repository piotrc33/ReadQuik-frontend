import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { User } from "src/app/api/model/user.i";
import { LoginDataI } from "src/app/api/model/loginData.i";

@Injectable()
export class AuthService {
  headers = {'content-type': 'application/json'}

  constructor(private http: HttpClient) {}

  signup(user: User): Observable<any> {
    const url = 'http://localhost:3001/signup';
    const body = JSON.stringify(user);

    return this.http.post(url, body, {'headers': this.headers});
  }

  login(loginData: LoginDataI): Observable<any> {
    const url = 'http://localhost:3001/login';
    const body = JSON.stringify(loginData);

    return this.http.post(url, body, { headers: this.headers });
  }

  verifyUser(): Observable<any> {
    const url: string = 'http://localhost:3001/authorize';

    return this.http.get(url, { headers: this.headers });
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
  }

}