import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from 'src/app/shared/variables';
import { ReadingDataI } from '../model/reading-data.i';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReadingDataApiService {
  private readonly http = inject(HttpClient);

  getNextReadingData(bookId: string): Observable<ReadingDataI> {
    const url = `${baseUrl}/books/reading-data/${bookId}`;
    return this.http.get<ReadingDataI>(url);
  }

  getInitialReadingData(): Observable<ReadingDataI | null> {
    const url = `${baseUrl}/initial-data`;
    return this.http.get<ReadingDataI | null>(url);
  }

  getReadingDataForSegment(bookId: string, number: number) {
    const url = `${baseUrl}/books/book/${bookId}/segments/${number}`;
    return this.http.get<ReadingDataI>(url);
  }
}
