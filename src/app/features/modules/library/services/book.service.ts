import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Observable, Subject, Subscription, map, take, takeUntil, tap } from 'rxjs';
import { baseUrl } from 'src/app/shared/variables';
import { TextService } from '../../exercises/services/text.service';
import { BookI } from '../book.i';

@Injectable()
export class BookService implements OnDestroy {
  headers = { 'Content-Type': 'application/json' };
  textService = inject(TextService);

  phrasesWithNewlines: string[] = [];
  wordPhrases: string[] = [];

  currentBook$ = new Subject<BookI>();
  phrasesWithNewlines$: Observable<string[]> = this.currentBook$.pipe(
    map((book: BookI) =>
      this.textService.getFragmentsWithNewlines(book.segments[0].text)
    ),
    tap((phrases) => (this.phrasesWithNewlines = phrases))
  );
  wordPhrases$: Observable<string[]> = this.phrasesWithNewlines$.pipe(
    map((fragments: string[]) => this.textService.removeNewlines(fragments)),
    tap((phrases) => (this.wordPhrases = phrases))
  );

  sub: Subscription;

  constructor(private http: HttpClient) {
    this.sub = this.wordPhrases$.subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

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
        this.currentBook$.next(book);
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
