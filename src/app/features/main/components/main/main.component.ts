import { Component, OnInit, inject } from '@angular/core';
import { BookService } from '../../../library/services/book.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  private readonly bookService = inject(BookService);

  ngOnInit(): void {
    this.bookService.initialDataAction$.next();
  }
}
