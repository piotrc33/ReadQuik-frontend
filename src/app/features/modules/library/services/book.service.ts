import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Observable,
  ReplaySubject,
  filter,
  map,
  take,
  tap
} from 'rxjs';
import { ReadingDataI } from 'src/app/api/model/reading-data.i';
import { baseUrl } from 'src/app/shared/variables';
import { BookDataI } from '../../../../api/model/book-data.i';
import { TextService } from '../../exercises/services/text.service';
import { BookSegmentsI } from './../../../../api/model/book-segments.i';
import { SegmentI } from './../../../../api/model/segment.i';
import { UserI } from './../../../../api/model/user.i';

@Injectable()
export class BookService {
  headers = { 'Content-Type': 'application/json' };
  textService = inject(TextService);

  readingData$ = new ReplaySubject<ReadingDataI>(1);
  currentReadingData = toSignal<ReadingDataI>(this.readingData$.asObservable());

  currentBook$ = this.readingData$.pipe(map((data) => data.bookData));

  currentSegment: SegmentI | null = null;
  currentSegment$ = this.readingData$.pipe(
    map((data) => data.segment),
    tap((segment) => (this.currentSegment = segment))
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

  getNextReadingData(bookId: string) {
    console.log('getting reading data');
    const url = `${baseUrl}/books/reading-data/${bookId}`;
    this.http
      .get<ReadingDataI>(url)
      .pipe(take(1))
      .subscribe((data: ReadingDataI) => { 
        this.readingData$.next(data);
      });
  }

  initialData$(): Observable<ReadingDataI> {
    const url = `${baseUrl}/initial-data`;
    return this.http.get<ReadingDataI>(url);
  }

  // getSegment(
  //   bookId: string | undefined,
  //   number: number
  // ): Observable<SegmentI | null> {
  //   // console.log('getting segment');
  //   if (!bookId) {
  //     return of(null);
  //   }
  //   const url = `${baseUrl}/books/book/${bookId}/segments/${number}`;

  //   return this.http.get<SegmentI>(url);
  // }

  updateBookProgress(
    bookId: string,
    lastSegmentNumber: number
  ): Observable<UserI | null> {
    const url = `${baseUrl}/results/update-progress`;
    const body = JSON.stringify({ bookId, lastSegmentNumber });
    return this.http.put<UserI | null>(url, body, { headers: this.headers });
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
}
