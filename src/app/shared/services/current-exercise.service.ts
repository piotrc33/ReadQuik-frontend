import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subject,
  filter,
  map,
  merge
} from 'rxjs';

@Injectable()
export class CurrentExerciseService {
  private readonly router = inject(Router);
  initialExerciseNumberAction$ = new Subject<void>();
  initialExerciseNumber$ = this.initialExerciseNumberAction$.pipe(
    map(() => Number(this.router.url.split('/').pop()))
  );

  exerciseNumberFromNavigationChange$: Observable<number> =
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((e) => Number(e.url.split('/').pop()))
    );

  exerciseNumber = toSignal(
    merge(this.initialExerciseNumber$, this.exerciseNumberFromNavigationChange$)
  );

  currentExercise$ = new BehaviorSubject<number>(1);
}
