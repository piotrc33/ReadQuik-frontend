import { Component, OnDestroy } from '@angular/core';
import { TextService } from '../services/text.service';
import {
  Subscription,
  merge,
} from 'rxjs';
import { KeyboardService } from '../services/keyboard.service';
import { ExercisesStateService } from '../services/exercises-state.service';

@Component({
  selector: 'app-exercise',
  template: ''
})
export abstract class Exercise implements OnDestroy {
  nextSub: Subscription;
  exitSub: Subscription;

  constructor(
    textService: TextService,
    keyService: KeyboardService,
    public state: ExercisesStateService
  ) {
    this.state.bookFragments = textService.bookFragments;
    this.exitSub = keyService.exitPress$.subscribe(() => {
      state.end();
    });

    this.nextSub = merge(keyService.forwardingPress$, state.next$)
      .subscribe(() => {
        this.handleNextFragment();
      });
  }

  ngOnDestroy(): void {
    this.nextSub.unsubscribe();
    this.exitSub.unsubscribe();
    this.state.phraseNumber = 0;
  }

  nextFragment(): void {
    this.state.nextFragment();
  }

  handleNextFragment(): void {
    this.nextFragment();
    if (this.state.finished) {
      this.state.end();
    }
  }
}
