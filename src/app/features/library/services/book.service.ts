import { Injectable, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { FiltersI } from 'src/app/api/model/library/filters.i';
import { NewBookResponseI } from 'src/app/api/model/progress/new-book-response.i';
import { ReadingDataI } from 'src/app/api/model/reading-data.i';
import { BookSegmentsI } from '../../../api/model/book-segments.i';
import { BookDataI } from '../../../api/model/library/book-data.i';
import { SegmentI } from '../../../api/model/segment.i';
import { BookApiService } from '../../../api/services/book-api.service';
import { TextService } from '../../exercises/services/text.service';

@Injectable()
export class BookService {
  private readonly textService = inject(TextService);
  private readonly bookApiService = inject(BookApiService);

  readonly readingData: WritableSignal<ReadingDataI | null> = signal(null);

  readonly currentBookData: Signal<BookDataI | undefined> = computed(() => this.readingData()?.bookData);
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
