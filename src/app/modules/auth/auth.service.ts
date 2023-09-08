import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { User } from "src/app/api/model/user.i";

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {}

  signup(user: User): Observable<any> {
    const url = 'http://localhost:3001/signup';
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(user);

    return this.http.post(url, body, {'headers': headers});
  }
}