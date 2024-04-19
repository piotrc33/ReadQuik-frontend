import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { BookDataI } from 'src/app/api/model/library/book-data.i';
import { SegmentI } from 'src/app/api/model/segment.i';
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
  @Input()
  book?: BookDataI;

  @Input()
  segment?: SegmentI;

  @Output()
  changedSegment = new EventEmitter<number>();
}
