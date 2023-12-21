import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BookDataI } from 'src/app/api/model/book-data.i';

@Component({
  selector: 'book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss'],
})
export class BookCardComponent {
  @Input({required: true})
  book?: BookDataI;

  @Output()
  choose = new EventEmitter<void>();

  readonly flags: Record<string, string> = {
    Polish: '🇵🇱',
    English: '🇬🇧',
  };
}
