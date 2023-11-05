import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookI } from '../book.i';
import { Observable } from 'rxjs';
import { baseUrl } from 'src/app/shared/variables';

@Injectable()
export class BookService {
  headers = { 'Content-Type': 'application/json' };

  constructor(private http: HttpClient) {}

  getBook(id: string): Observable<BookI> {
    const url = `${baseUrl}/books/book/${id}`;
    return this.http.get<BookI>(url);
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
