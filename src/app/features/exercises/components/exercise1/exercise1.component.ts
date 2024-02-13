import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Exercise } from '../../model/exercise';
import { BookService } from 'src/app/features/library/services/book.service';

@Component({
  selector: 'exercise1',
  templateUrl: './exercise1.component.html',
  styleUrls: ['./exercise1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Exercise1Component extends Exercise {
  private readonly bookService = inject(BookService);

  wordPhrases = this.bookService.wordPhrases;
}
