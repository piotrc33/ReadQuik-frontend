import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subscription,
  filter,
  map,
  of,
  take,
  tap
} from 'rxjs';
import { InitialDataI } from 'src/app/api/model/initial-data.i';
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

  currentBookId = signal<string>('6551f6696d80ef17a3023e7e');
  currentBook$ = new BehaviorSubject<BookDataI>({
    _id: '',
    title: '',
  });

  segmentSub: Subscription;

  segmentNumber$ = new ReplaySubject<number>(1);
  currentSegment: SegmentI | null = null;
  // currentSegment$: Observable<SegmentI | null> = combineLatest([
  //   this.currentBook$, // skipping the initial value
  //   this.segmentNumber$,
  // ]).pipe(
  //   tap(([book, num]) => console.log(book, num)),
  //   switchMap(([book, num]) => this.getSegment(book._id, num)),
  //   tap((segment: SegmentI | null) => {
  //     this.currentSegment = segment;
  //   })
  // );

  currentSegment$ = new ReplaySubject<SegmentI>(1);

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

  constructor(private http: HttpClient) {
    this.segmentSub = this.currentSegment$.subscribe(segment => {
      this.currentSegment = segment;
    })
  }

  getBook(id: string): Observable<BookDataI> {
    const url = `${baseUrl}/books/book/${id}`;
    return this.http.get<BookDataI>(url);
  }

  chooseBook(id: string) {
    console.log('choosing book');
    const url = `${baseUrl}/books/change-book/${id}`;
    this.http
      .get<InitialDataI>(url)
      .pipe(take(1))
      .subscribe((data: InitialDataI) => {
        this.currentBook$.next(data.bookData);
        this.currentSegment$.next(data.segment);
      });
  }

  chooseBook$(id: string): Observable<BookDataI> {
    const url = `${baseUrl}/books/book/${id}`;
    return this.http
      .get<BookDataI>(url);
  }

  initialData$(): Observable<InitialDataI> {
    const url = `${baseUrl}/initial-data`;
    return this.http.get<InitialDataI>(url);
  }

  getSegment(
    bookId: string | undefined,
    number: number
  ): Observable<SegmentI | null> {
    // console.log('getting segment');
    if (!bookId) {
      return of(null);
    }
    const url = `${baseUrl}/books/book/${bookId}/segments/${number}`;

    return this.http.get<SegmentI>(url);
  }

  updateBookProgress(
    bookId: string,
    lastSegmentNumber: number
  ): Observable<UserI | null> {
    const url = `${baseUrl}/results/update-progress`;
    const body = JSON.stringify({ bookId, lastSegmentNumber });
    return this.http.put<UserI | null>(url, body, { headers: this.headers });
  }

  getLastReadBookId(): Observable<any> {
    const url = `${baseUrl}/results/last-result-book`;
    return this.http.get<any>(url).pipe(take(1));
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
