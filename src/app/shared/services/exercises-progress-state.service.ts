import { ReadingDataService } from 'src/app/shared/services/reading-data.service';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map, shareReplay, tap } from 'rxjs';
import { SingleProgressI } from 'src/app/api/model/progress/single-progress.i';

@Injectable({
  providedIn: 'root',
})
export class ExercisesProgressStateService {
  private readonly readingDataService = inject(ReadingDataService);

  private readonly exercisesProgress$: Observable<
    SingleProgressI[] | undefined
  > = this.readingDataService.readingData$.pipe(
    map((readingData) => readingData?.exercisesProgress),
    shareReplay()
  );

  currentExerciseUnlocked$ = new BehaviorSubject<boolean>(true); // this is only referenced in exercises state

  // this one is only referenced in exercises.html
  unlockedExercisesCount$ = this.exercisesProgress$.pipe(
    map((array) => {
      if (!array) return 1;
      if (array.length === 0) return 1;
      const lastElement = array[array.length - 1];
      return lastElement.timesFinished > 0 ? array.length + 1 : array.length;
    })
  );

  // this one also only in exercises.html
  getRepetitions(exerciseNumber: number): Observable<number> {
    return this.exercisesProgress$.pipe(
      map((progressArray) => {
        if (!progressArray) return 0;
        const currentExerciseProgress = progressArray.find(
          (item) => item.exerciseNumber === exerciseNumber
        );
        return currentExerciseProgress
          ? currentExerciseProgress.repetitions
          : 0;
      })
    );
  }

  // this is also only in exercises.html
  isExerciseUnlocked(exerciseNumber: number): Observable<boolean> {
    return this.unlockedExercisesCount$.pipe(
      map((count) => {
        if (exerciseNumber === 1) {
          return true;
        } else {
          return exerciseNumber <= count;
        }
      }),
      tap((val) => {
        this.currentExerciseUnlocked$.next(val);
      })
    );
  }
}
