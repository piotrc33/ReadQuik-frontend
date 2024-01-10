import { Component, OnDestroy, inject } from '@angular/core';
import { filter, merge } from 'rxjs';
import { SubscriptionContainer } from 'src/app/utils/subscription-container';
import { ExercisesStateService } from '../services/exercises-state.service';
import { KeyboardService } from '../services/keyboard.service';

@Component({
  selector: 'app-exercise',
  template: '',
})
export class Exercise implements OnDestroy {
  public readonly keyService = inject(KeyboardService);
  public readonly state = inject(ExercisesStateService);
  subs = new SubscriptionContainer();

  quitExercise$ = merge(this.keyService.exitPress$, this.state.exit$);
  nextAction$ = merge(this.keyService.forwardingPress$, this.state.next$);
  finished$ = merge(this.keyService.forwardingPress$, this.state.next$).pipe(
    filter(() => this.state.finished)
  );

  constructor() {
    this.subs.add = this.quitExercise$.subscribe(() => {
      this.state.end();
    });

    this.subs.add = this.nextAction$.subscribe(() => {
      this.handleNextFragment();
    });

    this.subs.add = this.finished$.subscribe(() => this.state.finish());
  }

  ngOnDestroy(): void {
    this.state.phraseNumber = 0;
    this.state.pageYPosition = 0;
    this.state.progressPercent = 0;
    this.subs.dispose();
  }

  nextFragment(): void {
    this.state.nextFragment();
  }

  handleNextFragment(): void {
    this.nextFragment();
  }
}
