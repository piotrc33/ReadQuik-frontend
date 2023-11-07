import { BookService } from './../modules/library/services/book.service';
import { Injectable } from '@angular/core';
import { BookI } from './../modules/library/book.i';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  currentBook$ = new Subject<BookI>();

  constructor() { }

  chooseBook(book: BookI) {
    console.log('Chosen book:', book.title);
    this.currentBook$.next(book);
  }
}
