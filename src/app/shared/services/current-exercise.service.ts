import { Injectable, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import {
  Observable,
  Subject,
  filter,
  map,
  merge,
  shareReplay,
  tap
} from 'rxjs';

@Injectable()
export class CurrentExerciseService {
  private readonly router = inject(Router);

  readonly initialExerciseNumberAction$ = new Subject<void>();
  private readonly initialExerciseNumber$ =
    this.initialExerciseNumberAction$.pipe(
      map(() => Number(this.router.url.split('/').pop())),
    );

  private readonly exerciseNumberFromNavigationChange$: Observable<number> =
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((e) => Number(e.urlAfterRedirects.split('/').pop())),
      filter((exercise) => !Number.isNaN(exercise)),
    );

  readonly exerciseNumber$: Observable<number> = merge(
    this.initialExerciseNumber$,
    this.exerciseNumberFromNavigationChange$
  ).pipe(shareReplay());

  readonly exerciseNumber: Signal<number> = toSignal(this.exerciseNumber$, {
    initialValue: 1,
  });
}
