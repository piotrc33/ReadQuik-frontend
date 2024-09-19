import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subject, map, merge, switchMap, tap } from 'rxjs';

import { ReadingData } from 'src/app/api/model/reading-data.i';
import { SaveData } from 'src/app/api/model/save-data.model';
import { ReadingDataApiService } from '../../../api/services/reading-data-api.service';
import { CurrentExerciseService } from '../current-exercise.service';
import { ReadingDataStateService } from './reading-data-state.service';

@Injectable()
export class ReadingDataService {
  readonly #readingDataApiService = inject(ReadingDataApiService);
  readonly #readingDataState = inject(ReadingDataStateService);
  readonly #currentExerciseService = inject(CurrentExerciseService);

  constructor() {
    this.readingData$.pipe(takeUntilDestroyed()).subscribe(data => {
      this.#readingDataState.updateReadingData(data);
    });
  }

  readonly changeBookAction = new Subject<string>();
  readonly nextReadingDataForBookAction$ = new Subject<string>();
  readonly #readingDataFromBookId$ = merge(
    this.changeBookAction,
    this.nextReadingDataForBookAction$
  ).pipe(
    switchMap(bookId => this.#readingDataApiService.getNextReadingData(bookId))
  );

  readonly changeSegmentAction = new Subject<number>();
  readonly #readingDataFromSegmentChange$ = this.changeSegmentAction.pipe(
    switchMap(segmentNumber =>
      this.#readingDataApiService.getReadingDataForSegment(
        this.#readingDataState.readingData().bookData._id,
        segmentNumber
      )
    )
  );

  readonly getNextReadingDataAction = new Subject<SaveData>();
  readonly #readingDataFromComplete$ = this.getNextReadingDataAction.pipe(
    switchMap(data => this.#readingDataApiService.completeExercise(data)),
    tap(data => {
      if (data.newUnlocked) {
        const current = this.#currentExerciseService.exerciseNumber();
        this.#currentExerciseService.nextExerciseNumberFromNewUnlockedAction$.next(
          current === 8 ? 8 : current + 1
        );
      }
    }),
    map(data => {
      const { newUnlocked, ...readingData } = data;
      return readingData as ReadingData;
    })
  );

  readonly readingData$: Observable<ReadingData> = merge(
    this.#readingDataFromBookId$,
    this.#readingDataFromSegmentChange$,
    this.#readingDataFromComplete$
  );
}
