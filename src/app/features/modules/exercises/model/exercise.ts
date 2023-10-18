import { Component, OnDestroy } from '@angular/core';
import { TextService } from '../services/text.service';
import { Observable, Subscription, filter, merge, takeUntil, tap } from 'rxjs';
import { KeyboardService } from '../services/keyboard.service';
import { ExercisesStateService } from '../services/exercises-state.service';

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
    textService: TextService,
    keyService: KeyboardService,
    public state: ExercisesStateService
  ) {
    this.state.bookFragments = textService.bookFragments;
    this.exitSub = keyService.exitPress$.subscribe(() => {
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
