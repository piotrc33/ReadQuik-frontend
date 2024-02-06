import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserI } from 'src/app/api/model/auth/user.i';
import { BookSegmentsI } from 'src/app/api/model/book-segments.i';
import { BookDataI } from 'src/app/api/model/library/book-data.i';
import { FiltersI } from 'src/app/api/model/library/filters.i';
import { NewBookResponseI } from 'src/app/api/model/progress/new-book-response.i';
import { ReadingDataI } from 'src/app/api/model/reading-data.i';
import { baseUrl } from 'src/app/shared/variables';

@Injectable()
export class BookApiService {
  private readonly headers = { 'Content-Type': 'application/json' };
  private readonly http = inject(HttpClient);

  readonly tags$ = this.http.get<string[]>(`${baseUrl}/books/all-tags`);

  getFilteredBooks(filters: FiltersI): Observable<BookDataI[]> {
    let params = new HttpParams();
    params = params.set('title', filters.title);
    params = params.set('author', filters.author);
    params = params.set('tags', filters.tags.join(','));
    params = params.set('language', filters.language);

    return this.http.get<BookDataI[]>(`${baseUrl}/books/filter`, { params });
  }

  // ********************************
  
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

  // ********************************

  updateBookProgress(
    bookId: string,
    lastSegmentNumber: number
  ): Observable<UserI | null> {
    const url = `${baseUrl}/results/update-progress`;
    const body = { bookId, lastSegmentNumber };
    return this.http.put<UserI | null>(url, body, { headers: this.headers });
  }

  getBooks(): Observable<BookDataI[]> {
    const url = `${baseUrl}/books`;
    return this.http.get<BookDataI[]>(url);
  }

  addBook(
    bookData: BookDataI,
    bookSegments: BookSegmentsI
  ): Observable<NewBookResponseI> {
    const url = `${baseUrl}/books/add-book`;
    const newBook = {
      ...bookData,
      ...bookSegments,
    };
    return this.http.post<NewBookResponseI>(url, newBook, {
      headers: this.headers,
    });
  }
}
