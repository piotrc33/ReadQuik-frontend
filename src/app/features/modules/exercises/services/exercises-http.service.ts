import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ExercisesHttpService {
  constructor(private http: HttpClient) {}

  headers = { 'content-type': 'application/json' };

  saveResult(wpm: number, exerciseNumber: number): Observable<any> {
    const url = 'http://localhost:3002/results/save-result';
    const body = JSON.stringify({ wpm, exerciseNumber });
    console.log('sending request');

    return this.http.post(url, body, { headers: this.headers });
  }
}
