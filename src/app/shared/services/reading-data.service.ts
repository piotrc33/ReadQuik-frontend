import { ReadingDataApiService } from './../../api/services/reading-data-api.service';
import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, merge, switchMap, tap, Observable } from 'rxjs';
import { ReadingDataI } from 'src/app/api/model/reading-data.i';
import { ExercisesProgressStateService } from './exercises-progress-state.service';

@Injectable()
export class ReadingDataService {
  private readonly readingDataApiService = inject(ReadingDataApiService);
  private readonly progressService = inject(ExercisesProgressStateService);

  readonly changeBookAction$ = new Subject<string>();
  readonly nextReadingDataForBookAction$ = new Subject<string>();
  readonly readingDataFromBookId$ = merge(
    this.changeBookAction$,
    this.nextReadingDataForBookAction$
  ).pipe(
    switchMap((bookId) => this.readingDataApiService.getNextReadingData(bookId))
  );

  readonly initialDataAction$ = new Subject<void>();
  readonly readingDataFromInitialData$ = this.initialDataAction$.pipe(
    switchMap(() => this.readingDataApiService.getInitialReadingData()),
    tap((readingData) => {
      if (readingData) this.progressService.next(readingData.exercisesProgress);
    })
  );

  readonly changeSegmentAction$ = new Subject<number>();
  readonly readingDataFromSegmentChange$ = this.changeSegmentAction$.pipe(
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
  );
  
  readonly readingData = toSignal(this.readingData$, { initialValue: null });
}
