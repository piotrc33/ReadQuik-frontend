import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

import { BookData } from 'src/app/api/model/library/book-data.i';
import { ReadingDataFacade } from 'src/app/shared/services/reading-data/reading-data.facade';
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
  readonly #readingDataFacade = inject(ReadingDataFacade);

  get book(): BookData {
    return this.#readingDataFacade.bookData();
  }

  get segmentNumber(): number {
    return this.#readingDataFacade.segmentNumber();
  }

  changeSegment(segmentNumber: number) {
    this.#readingDataFacade.changeSegment(segmentNumber);
  }
}
