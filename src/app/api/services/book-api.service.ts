import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BookSegmentsI } from 'src/app/api/model/book-segments.i';
import { BookData } from 'src/app/api/model/library/book-data.i';
import { Filters } from 'src/app/api/model/library/filters.i';
import { NewBookResponseI } from 'src/app/api/model/progress/new-book-response.i';
import { baseUrl } from 'src/app/shared/variables';

@Injectable({
  providedIn: 'root'
})
export class BookApiService {
  readonly #headers = { 'Content-Type': 'application/json' };
  readonly #http = inject(HttpClient);

  getTags(): Observable<string[]> {
    return this.#http.get<string[]>(`${baseUrl}/books/all-tags`);
  }

  getFilteredBooks(filters: Filters): Observable<BookData[]> {
    let params = new HttpParams();
    params = params.set('title', filters.title);
    params = params.set('author', filters.author);
    params = params.set('tags', filters.tags.join(','));
    params = params.set('language', filters.language);

    return this.#http.get<BookData[]>(`${baseUrl}/books/filter`, { params });
  }

  getBooks(): Observable<BookData[]> {
    const url = `${baseUrl}/books`;
    return this.#http.get<BookData[]>(url);
  }

  addBook(
    bookData: BookData,
    bookSegments: BookSegmentsI
  ): Observable<NewBookResponseI> {
    const url = `${baseUrl}/books/add-book`;
    const newBook = {
      ...bookData,
      ...bookSegments,
    };
    return this.#http.post<NewBookResponseI>(url, newBook, {
      headers: this.#headers,
    });
  }
}
