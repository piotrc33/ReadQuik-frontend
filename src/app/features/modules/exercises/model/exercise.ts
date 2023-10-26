import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription, filter, merge } from 'rxjs';
import { ExercisesStateService } from '../services/exercises-state.service';
import { KeyboardService } from '../services/keyboard.service';

@Component({
  selector: 'app-exercise',
  template: '',
})
export class Exercise implements OnDestroy {
  nextSub: Subscription;
  exitSub: Subscription;
  finished$: Observable<void>;
  finishSub: Subscription;

  constructor(
    keyService: KeyboardService,
    public state: ExercisesStateService
  ) {
    this.exitSub = merge(keyService.exitPress$, state.exit$).subscribe(() => {
      state.end();
    });

    this.nextSub = merge(keyService.forwardingPress$, state.next$).subscribe(
      () => {
        this.handleNextFragment();
      }
    );

    this.finished$ = merge(keyService.forwardingPress$, state.next$).pipe(
      filter(() => this.state.finished)
    );

    this.finishSub = this.finished$.subscribe(() => this.state.end());
  }

  ngOnDestroy(): void {
    this.nextSub.unsubscribe();
    this.exitSub.unsubscribe();
    this.finishSub.unsubscribe();
    this.state.phraseNumber = 0;
  }

  nextFragment(): void {
    this.state.nextFragment();
  }

  handleNextFragment(): void {
    this.nextFragment();
  }
}
