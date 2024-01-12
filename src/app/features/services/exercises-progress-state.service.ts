import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { SingleProgressI } from 'src/app/api/model/single-progress.i';

@Injectable({
  providedIn: 'root',
})
export class ExercisesProgressStateService {
  private exercisesProgress$ = new BehaviorSubject<SingleProgressI[]>([]);

  unlockedExercisesCount$ = this.exercisesProgress$.asObservable().pipe(
    map((array) => {
      if(array.length === 0) return 1;
      const lastElement = array[array.length - 1];
      return lastElement.timesFinished > 0 ? array.length + 1 : array.length;
    })
  );

  constructor() {}

  getExercisesProgress(): Observable<SingleProgressI[]> {
    return this.exercisesProgress$;
  }

  next(newValue: SingleProgressI[]) {
    this.exercisesProgress$.next(newValue);
  }

  getRepetitions(exerciseNumber: number): Observable<number> {
    return this.exercisesProgress$.pipe(
      map((progressArray) => {
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
      map(count => exerciseNumber <= count)
    )    
  }
}
