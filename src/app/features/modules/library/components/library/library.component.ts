import { Component, OnInit, inject } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { BookDataI } from 'src/app/api/model/book-data.i';
import { FiltersI } from '../../../../../api/model/filters.i';
import { BookService } from './../../services/book.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit {
  readonly bookService = inject(BookService);
  booksSubject = new BehaviorSubject<BookDataI[]>([]);
  books$ = this.booksSubject.asObservable();

  ngOnInit(): void {
    this.bookService
      .getBooks()
      .pipe(take(1))
      .subscribe((books) => {
        this.booksSubject.next(books);
      });
  }

  handleFilter(filters: FiltersI) {
    this.bookService
      .getFilteredBooks$(filters)
      .pipe(take(1))
      .subscribe((filteredBooks) => {
        this.booksSubject.next(filteredBooks);
      });
  }
}
