import { Component, input, output } from '@angular/core';
import { BookData } from 'src/app/api/model/library/book-data.i';
import { flags } from 'src/app/shared/misc/flags';

@Component({
  selector: 'book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss'],
})
export class BookCardComponent {
  readonly flags = flags;

  readonly book = input.required<BookData>();
  readonly choose = output();
}
