import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookI } from '../book.i';
import { Observable, take } from 'rxjs';
import { baseUrl } from 'src/app/shared/variables';
import { AppStateService } from 'src/app/features/services/app-state.service';

@Injectable()
export class BookService {
  headers = { 'Content-Type': 'application/json' };

  constructor(private http: HttpClient, private appState: AppStateService) {}

  getBook(id: string): Observable<BookI> {
    const url = `${baseUrl}/books/book/${id}`;
    return this.http.get<BookI>(url);
  }

  chooseBook(id: string) {
    const url = `${baseUrl}/books/book/${id}`;
    this.http
      .get<BookI>(url)
      .pipe(take(1))
      .subscribe((book: BookI) => {
        this.appState.chooseBook(book);
      });
  }

  getBooks(): Observable<BookI[]> {
    const url = `${baseUrl}/books`;
    return this.http.get<BookI[]>(url);
  }

  addBook(book: BookI): Observable<any> {
    const url = `${baseUrl}/books/add-book`;
    const body = JSON.stringify(book);
    return this.http.post(url, body, { headers: this.headers });
  }
}
