import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, map, merge, switchMap } from 'rxjs';
import { BookDataI } from 'src/app/api/model/library/book-data.i';
import { FiltersI } from '../../../../api/model/library/filters.i';
import { BookService } from '../../services/book.service';
import { ReadingDataService } from 'src/app/shared/services/reading-data/reading-data.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryComponent {
  private readonly router = inject(Router);
  public readonly bookService = inject(BookService);
  readonly #readingDataService = inject(ReadingDataService);
  readonly #route = inject(ActivatedRoute);

  allBooks$ = this.bookService.getBooks();

  filtering$ = new Subject<FiltersI>();
  filteredBooks$ = this.filtering$.pipe(
    switchMap((filters: FiltersI) => this.bookService.getFilteredBooks(filters))
  );

  books: Signal<BookDataI[] | undefined> = toSignal(
    merge(this.allBooks$, this.filteredBooks$)
  );

  tags: Signal<string[]> = toSignal(
    this.#route.data.pipe(map((data) => data['tags']))
  );

  chooseBook(bookId: string) {
    this.#readingDataService.changeBookAction.next(bookId);
    this.router.navigate(['/app/exercises']);
  }
}
