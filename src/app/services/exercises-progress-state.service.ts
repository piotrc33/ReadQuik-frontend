import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  map,
  tap
} from 'rxjs';
import { SingleProgressI } from 'src/app/api/model/single-progress.i';

@Injectable({
  providedIn: 'root',
})
export class ExercisesProgressStateService {
  private exercisesProgress$ = new BehaviorSubject<SingleProgressI[] | null>(null);
  currentExerciseUnlocked$ = new BehaviorSubject<boolean>(true);

  unlockedExercisesCount$ = this.exercisesProgress$.asObservable().pipe(
    map((array) => {
      if (!array) return 1;
      if (array.length === 0) return 1;
      const lastElement = array[array.length - 1];
      return lastElement.timesFinished > 0 ? array.length + 1 : array.length;
    })
  );

  next(newValue: SingleProgressI[]) {
    this.exercisesProgress$.next(newValue);
  }

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
