import { UserI } from './../../../../api/model/user.i';
import { BookSegmentsI } from './../../../../api/model/book-segments.i';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  filter,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { baseUrl } from 'src/app/shared/variables';
import { TextService } from '../../exercises/services/text.service';
import { BookDataI } from '../../../../api/model/book-data.i';
import { SegmentI } from '../../../../api/model/segment.i';

@Injectable()
export class BookService {
  headers = { 'Content-Type': 'application/json' };
  textService = inject(TextService);

  currentBookId = signal<string>('6551f6696d80ef17a3023e7e');

  currentBook$ = new BehaviorSubject<BookDataI | null>(null);
  currentSegment$: Observable<SegmentI | null> = this.currentBook$.pipe(
    map((book) => book?._id),
    switchMap((bookId) => this.getSegment(bookId, 1))
  );

  phrasesWithNewlines: string[] = [];
  phrasesWithNewlines$: Observable<string[]> = this.currentSegment$.pipe(
    filter((segment: SegmentI | null): segment is SegmentI => segment !== null),
    map((segment: SegmentI) =>
      this.textService.getFragmentsWithNewlines(segment.text)
    ),
    tap((phrases) => (this.phrasesWithNewlines = phrases))
  );

  wordPhrases: string[] = [];
  wordPhrases$: Observable<string[]> = this.phrasesWithNewlines$.pipe(
    map((fragments: string[]) => this.textService.removeNewlines(fragments)),
    tap((phrases) => (this.wordPhrases = phrases))
  );

  constructor(private http: HttpClient) {}

  getBook(id: string): Observable<BookDataI> {
    const url = `${baseUrl}/books/book/${id}`;
    return this.http.get<BookDataI>(url);
  }

  chooseBook(id: string) {
    const url = `${baseUrl}/books/book/${id}`;
    this.http
      .get<BookDataI>(url)
      .pipe(take(1))
      .subscribe((book: BookDataI) => {
        this.currentBook$.next(book);
      });
  }

  getSegment(
    bookId: string | undefined,
    number: number
  ): Observable<SegmentI | null> {
    if (!bookId) {
      return of(null);
    }
    const url = `${baseUrl}/books/book/${bookId}/segments/${number}`;

    return this.http.get<SegmentI>(url);
  }

  getBooks(): Observable<BookDataI[]> {
    const url = `${baseUrl}/books`;
    return this.http.get<BookDataI[]>(url);
  }

  addBook(bookData: BookDataI, bookSegments: BookSegmentsI): Observable<any> {
    const url = `${baseUrl}/books/add-book`;
    const newBook = {
      ...bookData,
      ...bookSegments,
    };
    const body = JSON.stringify(newBook);
    return this.http.post(url, body, { headers: this.headers });
  }

  updateProgress(
    bookId: string,
    lastSegmentNumber: number
  ): Observable<UserI | null> {
    const url = `${baseUrl}/results/update-progress`;
    const body = JSON.stringify({ bookId, lastSegmentNumber });
    return this.http.put<UserI | null>(url, body, { headers: this.headers });
  }
}
