import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FiltersI } from 'src/app/api/model/library/filters.i';
import { NewBookResponseI } from 'src/app/api/model/progress/new-book-response.i';
import { BookSegmentsI } from '../../../api/model/book-segments.i';
import { BookDataI } from '../../../api/model/library/book-data.i';
import { BookApiService } from '../../../api/services/book-api.service';

@Injectable()
export class BookService {
  readonly #bookApiService = inject(BookApiService);

  getTags() {
    return this.#bookApiService.getTags();
  }

  getFilteredBooks(filters: FiltersI): Observable<BookDataI[]> {
    return this.#bookApiService.getFilteredBooks(filters);
  }

  getBooks(): Observable<BookDataI[]> {
    return this.#bookApiService.getBooks();
  }

  addBook(
    bookData: BookDataI,
    bookSegments: BookSegmentsI
  ): Observable<NewBookResponseI> {
    return this.#bookApiService.addBook(bookData, bookSegments);
  }
}
