import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { map, take } from 'rxjs';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit {
  books$ = this.bookService.getBooks().pipe(take(1));

  constructor(public bookService: BookService) {}

  ngOnInit(): void {}
}
