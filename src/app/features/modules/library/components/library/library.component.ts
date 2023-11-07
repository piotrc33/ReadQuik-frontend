import { Component, OnInit } from '@angular/core';
import { take, tap } from 'rxjs';
import { BookService } from './../../services/book.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit {
  books$ = this.bookService.getBooks().pipe(take(1), tap(console.log));

  constructor(
    public bookService: BookService
  ) {}

  ngOnInit(): void {}
}
