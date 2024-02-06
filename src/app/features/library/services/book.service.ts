import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
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

  readingData: WritableSignal<ReadingDataI | null> = signal(null);

  currentBookData = computed(() => this.readingData()?.bookData);
  currentBookId = computed(() => {
    const currentBook = this.currentBookData();
    return currentBook ? currentBook._id : '';
  })

  segmentData: Signal<SegmentI | undefined> = computed(() => this.readingData()?.segment);

  currentSegment: Signal<SegmentI | null> = computed(() => {
    const readingData = this.readingData();
    return readingData ? readingData.segment : null;
  });

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
          this.readingData.set(data);
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
          this.readingData.set(data);
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
