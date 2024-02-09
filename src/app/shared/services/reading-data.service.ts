import { ReadingDataApiService } from './../../api/services/reading-data-api.service';
import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, merge, switchMap, tap, Observable, shareReplay } from 'rxjs';
import { ReadingDataI } from 'src/app/api/model/reading-data.i';

@Injectable()
export class ReadingDataService {
  private readonly readingDataApiService = inject(ReadingDataApiService);

  readonly changeBookAction$ = new Subject<string>();
  readonly nextReadingDataForBookAction$ = new Subject<string>();
  private readonly readingDataFromBookId$ = merge(
    this.changeBookAction$,
    this.nextReadingDataForBookAction$
  ).pipe(
    switchMap((bookId) => this.readingDataApiService.getNextReadingData(bookId))
  );

  readonly initialDataAction$ = new Subject<void>();
  private readonly readingDataFromInitialData$ = this.initialDataAction$.pipe(
    switchMap(() => this.readingDataApiService.getInitialReadingData())
  );

  readonly changeSegmentAction$ = new Subject<number>();
  private readonly readingDataFromSegmentChange$ =
    this.changeSegmentAction$.pipe(
      switchMap((segmentNumber) =>
        this.readingDataApiService.getReadingDataForSegment(
          this.readingData()?.bookData._id || '',
          segmentNumber
        )
      )
    );

  readonly readingData$: Observable<ReadingDataI | null> = merge(
    this.readingDataFromBookId$,
    this.readingDataFromInitialData$,
    this.readingDataFromSegmentChange$
  ).pipe(shareReplay());

  readonly readingData = toSignal(this.readingData$, { initialValue: null });
}
