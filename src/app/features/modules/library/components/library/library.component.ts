import { Component } from '@angular/core';
import { BookService } from './../../services/book.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent {
  books$ = this.bookService.getBooks();

  constructor(
    public bookService: BookService
  ) {}
}
