import { Injectable, OnDestroy } from '@angular/core';
import { TextService } from '../services/text.service';
import { Subscription } from 'rxjs';
import { KeyboardService } from '../services/keyboard.service';
import { ExercisesStateService } from '../services/exercises-state.service';

@Injectable()
export abstract class Exercise implements OnDestroy {
  forwardSub: Subscription;
  exitSub: Subscription;

  constructor(
    textService: TextService,
    keyService: KeyboardService,
    public state: ExercisesStateService
  ) {
    this.state.bookFragments = textService.bookFragments;
    this.forwardSub = keyService.forwardingPress.subscribe(() => {
      this.handleForwardingKey();
    });
    this.exitSub = keyService.exitPress.subscribe(() => {
      state.end();
    });
  }

  ngOnDestroy(): void {
    this.forwardSub.unsubscribe();
    this.exitSub.unsubscribe();
    this.state.phraseNumber = 0;
  }

  nextFragment(): void {
    this.state.nextFragment();
  }

  handleForwardingKey(): void {
    this.nextFragment();
    if (this.state.finished) {
      this.state.end();
    }
  }
}
