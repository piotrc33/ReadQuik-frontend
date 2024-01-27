import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultI } from 'src/app/api/model/progress/result.i';
import { SingleProgressI } from 'src/app/api/model/progress/single-progress.i';
import { baseUrl } from 'src/app/shared/variables';

@Injectable()
export class ExercisesHttpService {
  constructor(private http: HttpClient) {}

  headers = { 'content-type': 'application/json' };

  saveResult(
    wpm: number,
    exerciseNumber: number,
    bookId: string
  ): Observable<ResultI> {
    const url: string = `${baseUrl}/results/save-result`;
    const body: string = JSON.stringify({ wpm, exerciseNumber, bookId });

    return this.http.post<ResultI>(url, body, { headers: this.headers });
  }

  updateExercisesProgress$(
    exerciseNumber: number
  ): Observable<SingleProgressI[]> {
    const url: string = `${baseUrl}/progress/update-exercise-progress`;
    const body: string = JSON.stringify({ exerciseNumber });

    return this.http.post<SingleProgressI[]>(url, body, {
      headers: this.headers,
    });
  }
}
