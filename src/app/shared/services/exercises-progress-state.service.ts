import { Injectable, Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Observable,
  ReplaySubject,
  Subject,
  combineLatest,
  filter,
  map,
  tap,
} from 'rxjs';
import { SingleProgressI } from 'src/app/api/model/progress/single-progress.i';
import { CurrentExerciseService } from './current-exercise.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ExercisesProgressStateService {
  private readonly currentExerciseService = inject(CurrentExerciseService);
  private readonly router = inject(Router);

  readonly exercisesProgress$ = new ReplaySubject<
    SingleProgressI[] | undefined
  >(1);

  private readonly currentExerciseProgress$: Observable<
    SingleProgressI | undefined
  > = combineLatest([
    this.exercisesProgress$,
    this.currentExerciseService.exerciseNumber$,
  ]).pipe(
    map(([progressArray, exNum]) => {
      return progressArray?.find((item) => item.exerciseNumber === exNum);
    })
  );

  completedExercise$ = new Subject<void>();
  unlockedNewExercise$ = combineLatest([
    this.completedExercise$,
    this.currentExerciseProgress$,
  ]).pipe(
    filter(([_, progress]) => {
      return progress?.repetitions === 9 && progress.exerciseNumber !== 8;
    }),
    tap(([,progress]) => {
      this.router.navigate(['/app/exercises/' + progress?.exerciseNumber + 1])
    }),
    map(() => true)
  );
  unlockedExerciseSub = toSignal(this.unlockedNewExercise$);

  readonly currentExerciseRepetitions: Signal<number | undefined> = toSignal(
    this.currentExerciseProgress$.pipe(
      map((progress) => progress?.repetitions || 0)
    ),
    { initialValue: 0 }
  );

  readonly unlockedExercisesCount: Signal<number> = toSignal(
    this.exercisesProgress$.pipe(
      map((array) => {
        if (!array || array.length === 0) return 1;
        const lastElement = array[array.length - 1];
        return lastElement.timesFinished > 0 ? array.length + 1 : array.length;
      })
    ),
    {
      initialValue: 1,
    }
  );

  readonly isCurrentExerciseUnlocked = computed(() => {
    return (
      this.currentExerciseService.exerciseNumber() <=
      this.unlockedExercisesCount()
    );
  });
}
