import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BookDataI } from 'src/app/api/model/book-data.i';
import { flags } from 'src/app/shared/misc/flags';

@Component({
  selector: 'book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss'],
})
export class BookCardComponent {
  readonly flags = flags;

  @Input({required: true})
  book?: BookDataI;

  @Output()
  choose = new EventEmitter<void>();
}
