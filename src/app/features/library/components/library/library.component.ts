import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, map, merge, switchMap } from 'rxjs';
import { BookData } from 'src/app/api/model/library/book-data.i';
import { ReadingDataFacade } from 'src/app/shared/services/reading-data/reading-data.facade';
import { Filters } from '../../../../api/model/library/filters.i';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryComponent {
  readonly #router = inject(Router);
  readonly #bookService = inject(BookService);
  readonly #readingDataFacade = inject(ReadingDataFacade);
  readonly #route = inject(ActivatedRoute);

  allBooks$ = this.#bookService.getBooks();

  filtering$ = new Subject<Filters>();
  filteredBooks$ = this.filtering$.pipe(
    switchMap((filters: Filters) => this.#bookService.getFilteredBooks(filters))
  );

  books: Signal<BookData[]> = toSignal(
    merge(this.allBooks$, this.filteredBooks$),
    { initialValue: [] }
  );

  tags: Signal<string[]> = toSignal(
    this.#route.data.pipe(map(data => data['tags']))
  );

  chooseBook(bookId: string) {
    this.#readingDataFacade.chooseBook(bookId);
    this.#router.navigate(['/app/exercises']);
  }
}
