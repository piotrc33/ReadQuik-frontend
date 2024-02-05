import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, ReplaySubject, map, tap } from 'rxjs';
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

  currentSegment: Signal<SegmentI | null> = toSignal(
    this.readingData$.pipe(map((data) => data.segment)),
    { initialValue: null }
  );

  phrasesWithNewlines: Signal<string[]> = computed(() => {
    const currentSegment = this.currentSegment();
    if (currentSegment)
      return this.textService.getFragmentsWithNewlines(currentSegment.text);
    return [];
  });

  wordPhrases: Signal<string[]> = computed(() =>
    this.textService.removeNewlines(this.phrasesWithNewlines())
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
