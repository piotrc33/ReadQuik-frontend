import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SingleProgressI } from 'src/app/api/model/single-progress.i';
import { baseUrl } from 'src/app/shared/variables';

@Injectable()
export class ExercisesHttpService {
  constructor(private http: HttpClient) {}

  headers = { 'content-type': 'application/json' };

  saveResult(
    wpm: number,
    exerciseNumber: number,
    bookId: string
  ): Observable<any> {
    const url = `${baseUrl}/results/save-result`;
    const body = JSON.stringify({ wpm, exerciseNumber, bookId });
    console.log('sending request');

    return this.http.post(url, body, { headers: this.headers });
  }

  updateExercisesProgress$(exerciseNumber: number) {
    const url = `${baseUrl}/progress/update-exercise-progress`;
    const body = JSON.stringify({ exerciseNumber });

    return this.http.post<SingleProgressI[]>(url, body, { headers: this.headers });
  }
}
