import { Component, OnDestroy } from '@angular/core';
import { Subscription, filter, merge } from 'rxjs';
import { ExercisesStateService } from '../services/exercises-state.service';
import { KeyboardService } from '../services/keyboard.service';

@Component({
  selector: 'app-exercise',
  template: '',
})
export class Exercise implements OnDestroy {
  subs: Subscription[] = [];

  quitExercise$ = merge(this.keyService.exitPress$, this.state.exit$);
  nextAction$ = merge(this.keyService.forwardingPress$, this.state.next$);
  finished$ = merge(this.keyService.forwardingPress$, this.state.next$).pipe(
    filter(() => this.state.finished)
  );

  constructor(
    private keyService: KeyboardService,
    public state: ExercisesStateService
  ) {
    this.subs.push(
      this.quitExercise$.subscribe(() => {
        state.end();
      })
    );

    this.subs.push(
      this.nextAction$.subscribe(() => {
        this.handleNextFragment();
      })
    );

    this.subs.push(this.finished$.subscribe(() => this.state.finish()));
  }

  ngOnDestroy(): void {
    this.state.phraseNumber = 0;

    this.subs.forEach((sub) => sub.unsubscribe());
  }

  nextFragment(): void {
    this.state.nextFragment();
  }

  handleNextFragment(): void {
    this.nextFragment();
  }
}
