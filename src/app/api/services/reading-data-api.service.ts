import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from 'src/app/shared/variables';
import { ReadingData } from '../model/reading-data.i';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReadingDataApiService {
  private readonly http = inject(HttpClient);

  getNextReadingData(bookId: string): Observable<ReadingData> {
    const url = `${baseUrl}/books/reading-data/${bookId}`;
    return this.http.get<ReadingData>(url);
  }

  getInitialReadingData(): Observable<ReadingData> {
    const url = `${baseUrl}/initial-data`;
    return this.http.get<ReadingData>(url);
  }

  getReadingDataForSegment(bookId: string, number: number) {
    const url = `${baseUrl}/books/book/${bookId}/segments/${number}`;
    return this.http.get<ReadingData>(url);
  }

  completeExercise(data: {
    wpm: number;
    exerciseNumber: number;
    bookId: string;
    lastSegmentNumber: number;
  }) {
    return this.http.post<ReadingData & { newUnlocked: boolean }>(
      `${baseUrl}/progress/complete-exercise`,
      data
    );
  }
}
