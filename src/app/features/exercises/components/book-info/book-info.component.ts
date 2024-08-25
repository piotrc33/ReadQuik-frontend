import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

import { BookDataI } from 'src/app/api/model/library/book-data.i';
import { ReadingDataStateService } from 'src/app/shared/services/reading-data/reading-data-state.service';
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
  readonly #readingData = inject(ReadingDataService);
  readonly #readingDataState = inject(ReadingDataStateService);

  get book(): BookDataI | undefined {
    return this.#readingDataState.bookData();
  }

  get segmentNumber(): number | undefined {
    return this.#readingDataState.segmentNumber();
  }

  changeSegment(segmentNumber: number) {
    this.#readingData.changeSegmentAction.next(segmentNumber);
  }
}
