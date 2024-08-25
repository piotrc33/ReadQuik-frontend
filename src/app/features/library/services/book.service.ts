import { Injectable, Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { FiltersI } from 'src/app/api/model/library/filters.i';
import { NewBookResponseI } from 'src/app/api/model/progress/new-book-response.i';
import { ReadingDataStateService } from 'src/app/shared/services/reading-data/reading-data-state.service';
import { BookSegmentsI } from '../../../api/model/book-segments.i';
import { BookDataI } from '../../../api/model/library/book-data.i';
import { SegmentI } from '../../../api/model/book/segment.i';
import { BookApiService } from '../../../api/services/book-api.service';
import { TextService } from '../../exercises/services/text.service';

@Injectable()
export class BookService {
  private readonly textService = inject(TextService);
  private readonly bookApiService = inject(BookApiService);
  readonly #readingDataState = inject(ReadingDataStateService);

  readonly currentBookData: Signal<BookDataI | undefined> = computed(() => {
    return this.#readingDataState.readingData()?.bookData;
  });
  readonly currentBookId = computed(() => {
    const currentBook = this.currentBookData();
    return currentBook ? currentBook._id : '';
  });

  readonly segmentData: Signal<SegmentI | undefined> = computed(
    () => this.#readingDataState.readingData()?.segment
  );

  readonly currentSegment: Signal<SegmentI | null> = computed(() => {
    const readingData = this.#readingDataState.readingData();
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

  getBooks(): Observable<BookDataI[]> {
    return this.bookApiService.getBooks();
  }

  addBook(
    bookData: BookDataI,
    bookSegments: BookSegmentsI
  ): Observable<NewBookResponseI> {
    return this.bookApiService.addBook(bookData, bookSegments);
  }
}
