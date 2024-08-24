import { Injectable, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, Subject, map, merge, shareReplay, switchMap, tap } from 'rxjs';
import { ReadingDataI } from 'src/app/api/model/reading-data.i';
import { ExercisesStateService } from 'src/app/features/exercises/services/exercises-state.service';
import { ReadingDataApiService } from '../../../api/services/reading-data-api.service';
import { ExercisesProgressStateService } from '../exercises-progress-state.service';
import { CurrentExerciseService } from '../current-exercise.service';
import { ReadingDataStateService } from './reading-data-state.service';

@Injectable()
export class ReadingDataService {
  private readonly readingDataApiService = inject(ReadingDataApiService);
  readonly #readingDataState = inject(ReadingDataStateService);
  private readonly progressService = inject(ExercisesProgressStateService);
  private readonly state = inject(ExercisesStateService);
  private readonly currentExerciseService = inject(CurrentExerciseService);

  readonly changeBookAction$ = new Subject<string>();
  readonly nextReadingDataForBookAction$ = new Subject<string>();
  private readonly readingDataFromBookId$ = merge(
    this.changeBookAction$,
    this.nextReadingDataForBookAction$
  ).pipe(
    switchMap((bookId) => this.readingDataApiService.getNextReadingData(bookId))
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

  readonly readingDataFromComplete$ = this.state.dataForSave$.pipe(
    switchMap((data) => this.readingDataApiService.completeExercise(data)),
    tap(data => {
      if(data.newUnlocked) {
        const current = this.currentExerciseService.exerciseNumber();
        this.currentExerciseService.nextExerciseNumberFromNewUnlockedAction$.next(
          current === 8 ? 8 : current + 1
        )
      }
    }),
    map(data => {
      const { newUnlocked, ...readingData } = data;
      return readingData as ReadingDataI;
    })
  );
  readonly readingData$: Observable<ReadingDataI> = merge(
    this.readingDataFromBookId$,
    this.readingDataFromSegmentChange$,
    this.readingDataFromComplete$
  ).pipe(
    tap((data) => {
      if (!data) {
        return;
      }
      this.#readingDataState.updateReadingData(data);
      this.progressService.exercisesProgress$.next(data.exercisesProgress);
    }),
    shareReplay()
  );

  readonly readingData: Signal<ReadingDataI | null> = toSignal(
    this.readingData$,
    { initialValue: null }
  );
}
