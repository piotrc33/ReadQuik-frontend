import { Injectable, Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, Subject, merge, switchMap, tap } from 'rxjs';
import { FiltersI } from 'src/app/api/model/library/filters.i';
import { NewBookResponseI } from 'src/app/api/model/progress/new-book-response.i';
import { ReadingDataI } from 'src/app/api/model/reading-data.i';
import { ExercisesProgressStateService } from 'src/app/services/exercises-progress-state.service';
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
  private readonly progressService = inject(ExercisesProgressStateService);

  readonly changeBookAction$ = new Subject<string>();
  readonly nextReadingDataForBookAction$ = new Subject<string>();
  readonly readingDataFromBookId$ = merge(
    this.changeBookAction$,
    this.nextReadingDataForBookAction$
  ).pipe(switchMap((bookId) => this.bookApiService.getNextReadingData(bookId)));

  readonly initialDataAction$ = new Subject<void>();
  readonly readingDataFromInitialData$ = this.initialDataAction$.pipe(
    switchMap(() => this.bookApiService.getInitialReadingData()),
    tap((readingData) => {
      if (readingData) this.progressService.next(readingData.exercisesProgress);
    })
  );

  readonly changeSegmentAction$ = new Subject<number>();
  readonly readingDataFromSegmentChange$ = this.changeSegmentAction$.pipe(
    switchMap((segmentNumber) =>
      this.bookApiService.getReadingDataForSegment(
        this.currentBookId(),
        segmentNumber
      )
    )
  );

  readonly readingData$: Observable<ReadingDataI | null> = merge(
    this.readingDataFromBookId$,
    this.readingDataFromInitialData$,
    this.readingDataFromSegmentChange$
  );
  readonly readingData = toSignal(this.readingData$, { initialValue: null });

  readonly currentBookData = computed(() => this.readingData()?.bookData);
  readonly currentBookId = computed(() => {
    const currentBook = this.currentBookData();
    return currentBook ? currentBook._id : '';
  });

  readonly segmentData: Signal<SegmentI | undefined> = computed(
    () => this.readingData()?.segment
  );

  readonly currentSegment: Signal<SegmentI | null> = computed(() => {
    const readingData = this.readingData();
    return readingData ? readingData.segment : null;
  });

  readonly phrasesWithNewlines: Signal<string[]> = computed(() => {
    const currentSegment = this.currentSegment();
    if (currentSegment)
      return this.textService.getFragmentsWithNewlines(currentSegment.text);
    return [];
  });

  readonly wordPhrases: Signal<string[]> = computed(() =>
    this.textService.removeNewlines(this.phrasesWithNewlines())
  );

  readonly tags: Signal<string[]> = toSignal(this.bookApiService.tags$, {
    initialValue: [],
  });

  getFilteredBooks(filters: FiltersI): Observable<BookDataI[]> {
    return this.bookApiService.getFilteredBooks(filters);
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
