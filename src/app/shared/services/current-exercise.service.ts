import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CurrentExerciseService {
  currentExercise$ = new BehaviorSubject<number>(1);
}
