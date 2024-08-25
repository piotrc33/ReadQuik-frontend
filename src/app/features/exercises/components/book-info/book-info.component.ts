import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

import { SegmentI } from 'src/app/api/model/book/segment.i';
import { BookDataI } from 'src/app/api/model/library/book-data.i';
import { BookService } from 'src/app/features/library/services/book.service';
import { ReadingDataService } from 'src/app/shared/services/reading-data/reading-data.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'book-info',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    TranslocoModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './book-info.component.html',
  styleUrl: './book-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookInfoComponent {
  readonly #bookService = inject(BookService);
  readonly #readingData = inject(ReadingDataService);

  get book(): BookDataI | undefined {
    return this.#bookService.currentBookData();
  }

  get segment(): SegmentI | undefined {
    return this.#bookService.segmentData();
  }

  changeSegment(segmentNumber: number) {
    this.#readingData.changeSegmentAction.next(segmentNumber);
  }
}
