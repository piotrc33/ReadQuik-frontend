import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Signal, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, ReplaySubject, filter, map, of, tap } from 'rxjs';
import { FiltersI } from 'src/app/api/model/library/filters.i';
import { NewBookResponseI } from 'src/app/api/model/progress/new-book-response.i';
import { ReadingDataI } from 'src/app/api/model/reading-data.i';
import { TagI } from 'src/app/api/model/tag.i';
import { baseUrl } from 'src/app/shared/variables';
import { UserI } from '../../../api/model/auth/user.i';
import { BookSegmentsI } from '../../../api/model/book-segments.i';
import { BookDataI } from '../../../api/model/library/book-data.i';
import { SegmentI } from '../../../api/model/segment.i';
import { TextService } from '../../exercises/services/text.service';

@Injectable()
export class BookService {
  headers = { 'Content-Type': 'application/json' };
  textService = inject(TextService);
  currentBookId = signal('');

  readingData$ = new ReplaySubject<ReadingDataI>(1);
  bookData$ = this.readingData$.pipe(
    map((data) => data.bookData),
    tap((book) => {
      this.currentBookId.set(book._id);
    })
  );
  segmentData$ = this.readingData$.pipe(map((data) => data.segment));

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

  wordPhrasesSignal: Signal<string[] | undefined> = toSignal(
    this.phrasesWithNewlines$.pipe(
      map((fragments: string[]) => this.textService.removeNewlines(fragments))
    )
  );

  tags: Signal<string[] | undefined> = toSignal(
    this.http.get<string[]>(`${baseUrl}/books/all-tags`)
  );

  constructor(private http: HttpClient) {}

  getBook(id: string): Observable<BookDataI> {
    const url = `${baseUrl}/books/book/${id}`;
    return this.http.get<BookDataI>(url);
  }

  getFilteredBooks$(filters: FiltersI): Observable<BookDataI[]> {
    let params = new HttpParams();
    params = params.set('title', filters.title);
    params = params.set('author', filters.author);
    params = params.set('tags', filters.tags.join(','));
    params = params.set('language', filters.language);

    return this.http.get<BookDataI[]>(`${baseUrl}/books/filter`, { params });
  }

  getNextReadingData(bookId: string) {
    console.log('getting reading data');
    const url = `${baseUrl}/books/reading-data/${bookId}`;
    this.http.get<ReadingDataI>(url).subscribe((data: ReadingDataI | null) => {
      if (data) {
        this.readingData$.next(data);
      }
    });
  }

  initialData$(): Observable<ReadingDataI> {
    const url = `${baseUrl}/initial-data`;
    return this.http.get<ReadingDataI>(url);
  }

  getReadingData(bookId: string, number: number) {
    const url = `${baseUrl}/books/book/${bookId}/segments/${number}`;
    this.http.get<ReadingDataI>(url).subscribe((data: ReadingDataI | null) => {
      if (data) {
        this.readingData$.next(data);
      }
    });
  }

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

  addBook(
    bookData: BookDataI,
    bookSegments: BookSegmentsI
  ): Observable<NewBookResponseI> {
    const url = `${baseUrl}/books/add-book`;
    const newBook = {
      ...bookData,
      ...bookSegments,
    };
    const body = JSON.stringify(newBook);
    return this.http.post<NewBookResponseI>(url, body, {
      headers: this.headers,
    });
  }

  addTag(newTag: string): Observable<TagI> {
    const url = `${baseUrl}/books/add-tag`;
    const newBook = {
      newTag,
    };
    const body = JSON.stringify(newBook);
    return this.http.post<TagI>(url, body, {
      headers: this.headers,
    });
  }
}
