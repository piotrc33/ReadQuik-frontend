import { Injectable, Signal, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, ReplaySubject, filter, map, tap } from 'rxjs';
import { FiltersI } from 'src/app/api/model/library/filters.i';
import { NewBookResponseI } from 'src/app/api/model/progress/new-book-response.i';
import { ReadingDataI } from 'src/app/api/model/reading-data.i';
import { UserI } from '../../../api/model/auth/user.i';
import { BookSegmentsI } from '../../../api/model/book-segments.i';
import { BookDataI } from '../../../api/model/library/book-data.i';
import { SegmentI } from '../../../api/model/segment.i';
import { TextService } from '../../exercises/services/text.service';
import { BookApiService } from './book-api.service';

@Injectable()
export class BookService {
  private readonly textService = inject(TextService);
  private readonly bookApiService = inject(BookApiService);
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

  wordPhrases: Signal<string[]> = toSignal(
    this.phrasesWithNewlines$.pipe(
      map((fragments: string[]) => this.textService.removeNewlines(fragments))
    ), { initialValue: [] }
  );

  tags: Signal<string[]> = toSignal(this.bookApiService.tags$, {
    initialValue: [],
  });

  getFilteredBooks(filters: FiltersI): Observable<BookDataI[]> {
    return this.bookApiService.getFilteredBooks(filters);
  }

  getNextReadingData(bookId: string) {
    this.bookApiService
      .getNextReadingData(bookId)
      .subscribe((data: ReadingDataI | null) => {
        if (data) {
          this.readingData$.next(data);
        }
      });
  }

  getInitialData(): Observable<ReadingDataI | null> {
    return this.bookApiService.getInitialData();
  }

  getReadingData(bookId: string, number: number) {
    this.bookApiService
      .getReadingData(bookId, number)
      .subscribe((data: ReadingDataI | null) => {
        if (data) {
          this.readingData$.next(data);
        }
      });
  }

  updateBookProgress(
    bookId: string,
    lastSegmentNumber: number
  ): Observable<UserI | null> {
    return this.bookApiService.updateBookProgress(bookId, lastSegmentNumber);
  }

  getBooks(): Observable<BookDataI[]> {
    return this.bookApiService.getBooks();
  }

  addBook(
    bookData: BookDataI,
    bookSegments: BookSegmentsI
  ): Observable<NewBookResponseI> {
    return this.bookApiService.addBook(bookData, bookSegments);
  }

  // addTag(newTag: string): Observable<TagI> {
  //   const url = `${baseUrl}/books/add-tag`;
  //   const newBook = {
  //     newTag,
  //   };
  //   const body = JSON.stringify(newBook);
  //   return this.http.post<TagI>(url, body, {
  //     headers: this.headers,
  //   });
  // }
}
